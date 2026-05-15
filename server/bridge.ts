/**
 * PayGent OpenClaw Bridge
 *
 * Thin HTTP runner that executes the OpenClaw artifacts in this repo:
 *   - skills/doku-billing/SKILL.md  -> system prompt (declarative workflow)
 *   - plugins/doku-payment/         -> tool implementation (real Doku Sandbox call)
 *
 * Why this exists: OpenClaw Gateway 2026.5.7 ships an embedded harness that
 * injects ~30k tokens of internal context per turn, which exceeds Groq's free-tier
 * TPM limits. This bridge is a minimal alternative runner that uses the SAME
 * SKILL.md and the SAME plugin tool function, just without the gateway's bundled
 * harness overhead.
 *
 * Endpoint: POST /api/message  body: { message: string }  -> { message: string }
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { config as loadDotenv } from "dotenv";
import {
  buildDokuSignature,
  executeDokuCreatePaymentLink,
  type DokuPaymentParams,
} from "@paygent/openclaw-doku-payment";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Also load the project root .env (one level up from this server/ folder).
loadDotenv({ path: join(__dirname, "..", ".env"), override: false });

// -- Config --------------------------------------------------------------------

const PORT = Number(process.env.OPENCLAW_BRIDGE_PORT ?? 3001);
const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_MODEL =
  process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const INVOICE_STORE_PATH = join(__dirname, "data", "invoices.json");

if (!GROQ_API_KEY) {
  console.error(
    "[bridge] FATAL: GROQ_API_KEY missing. Set it in paygent-autobiller/.env",
  );
  process.exit(1);
}

// -- Skill loader: parse SKILL.md and use its body as the system prompt --------

function loadSkillSystemPrompt(): string {
  const skillPath = join(
    __dirname,
    "..",
    "skills",
    "doku-billing",
    "SKILL.md",
  );
  const raw = readFileSync(skillPath, "utf8");
  // Strip YAML front-matter.
  const stripped = raw.replace(/^---[\s\S]*?---\s*/m, "").trim();
  return stripped;
}

const SKILL_PROMPT = loadSkillSystemPrompt();

// -- Minimal invoice status store ---------------------------------------------

type InvoiceStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "UNKNOWN";

interface StoredInvoice {
  invoiceNumber: string;
  status: InvoiceStatus;
  namaKlien?: string;
  itemDeskripsi?: string;
  nominalRupiah?: number;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  rawNotification?: unknown;
}

function loadInvoiceStore(): Record<string, StoredInvoice> {
  if (!existsSync(INVOICE_STORE_PATH)) return {};

  try {
    return JSON.parse(readFileSync(INVOICE_STORE_PATH, "utf8")) as Record<
      string,
      StoredInvoice
    >;
  } catch {
    return {};
  }
}

function saveInvoiceStore(store: Record<string, StoredInvoice>) {
  mkdirSync(dirname(INVOICE_STORE_PATH), { recursive: true });
  writeFileSync(INVOICE_STORE_PATH, JSON.stringify(store, null, 2));
}

function upsertInvoice(invoice: StoredInvoice) {
  const store = loadInvoiceStore();
  const previous = store[invoice.invoiceNumber];
  store[invoice.invoiceNumber] = {
    ...previous,
    ...invoice,
    createdAt: previous?.createdAt ?? invoice.createdAt,
    updatedAt: new Date().toISOString(),
  };
  saveInvoiceStore(store);
}

function saveCreatedInvoiceFromToolOutput(toolOutputText: string) {
  try {
    const parsed = JSON.parse(toolOutputText) as Record<string, unknown>;
    if (
      parsed.success !== true ||
      typeof parsed.invoice_number !== "string"
    ) {
      return;
    }

    const now = new Date().toISOString();
    upsertInvoice({
      invoiceNumber: parsed.invoice_number,
      status: "PENDING",
      namaKlien:
        typeof parsed.nama_klien === "string" ? parsed.nama_klien : undefined,
      itemDeskripsi:
        typeof parsed.item_deskripsi === "string"
          ? parsed.item_deskripsi
          : undefined,
      nominalRupiah:
        typeof parsed.nominal_rupiah === "number"
          ? parsed.nominal_rupiah
          : undefined,
      paymentUrl:
        typeof parsed.payment_url === "string" ? parsed.payment_url : undefined,
      createdAt: now,
      updatedAt: now,
      paidAt: null,
    });
  } catch {
    // Non-JSON tool output means there is no invoice to persist.
  }
}

// -- Tool schema exposed to Groq (OpenAI-compatible function calling) ---------

const dokuTool = {
  type: "function" as const,
  function: {
    name: "doku_create_payment_link",
    description:
      "Gunakan tool ini untuk membuat payment link Doku ketika user meminta untuk menagih seseorang. Ekstrak nama_klien, item_deskripsi, dan nominal_rupiah dari permintaan user.",
    parameters: {
      type: "object",
      properties: {
        nama_klien: {
          type: "string",
          description: "Nama lengkap klien yang akan ditagih",
        },
        item_deskripsi: {
          type: "string",
          description: "Deskripsi item atau jasa yang ditagihkan",
        },
        nominal_rupiah: {
          type: "number",
          description:
            "Jumlah tagihan dalam Rupiah (contoh: 1500000 untuk 1.5 juta)",
        },
      },
      required: ["nama_klien", "item_deskripsi", "nominal_rupiah"],
    },
  },
};

function normalizeIntentText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function isContextQuestion(userMessage: string): boolean {
  const text = normalizeIntentText(userMessage);

  const contextPatterns = [
    /\b(sudah|udah|telah)\s+(di)?bayar\b/,
    /\b(belum|blm)\s+(di)?bayar\b/,
    /\bpaid\b|\bunpaid\b|\bstatus\b/,
    /\bcek\b.*\b(pembayaran|bayar|status)\b/,
    /\btahu\b.*\b(dibayar|bayar|status)\b/,
    /\bbisa\b.*\b(tahu|cek|lihat|monitor)\b/,
    /\bberlaku\b.*\b(kapan|berapa|sampai)\b/,
    /\bexpired\b|\bkedaluwarsa\b/,
    /\b(gimana|bagaimana|apa)\b.*\b(paygent|ini|link|invoice|tagihan)\b/,
  ];

  return contextPatterns.some((pattern) => pattern.test(text));
}

function isPaymentStatusQuestion(userMessage: string): boolean {
  const text = normalizeIntentText(userMessage);

  return [
    /\b(sudah|udah|telah)\s+(di)?bayar\b/,
    /\b(belum|blm)\s+(di)?bayar\b/,
    /\bpaid\b|\bunpaid\b/,
    /\bstatus\b.*\b(pembayaran|bayar|tagihan|invoice)\b/,
    /\bcek\b.*\b(pembayaran|bayar|status)\b/,
    /\btahu\b.*\b(dibayar|bayar|status)\b/,
  ].some((pattern) => pattern.test(text));
}

function hasCreateBillingIntent(text: string): boolean {
  return [
    "tagih",
    "tagihkan",
    "buat tagihan",
    "buat invoice",
    "bikin tagihan",
    "bikin invoice",
    "generate payment link",
    "buat payment link",
    "buat link pembayaran",
    "kirim bill",
    "request pembayaran",
  ].some((phrase) => text.includes(phrase));
}

function formatRupiah(amount?: number): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseInvoiceFromText(content: string): Partial<StoredInvoice> | null {
  const invoiceNumber = content.match(/INV-[A-Z0-9]+/i)?.[0]?.toUpperCase();
  if (!invoiceNumber) return null;

  const nominalText = content.match(/Rp\s*([\d.,]+)/i)?.[1];
  const nominalRupiah = nominalText
    ? Number.parseInt(nominalText.replace(/[.,]/g, ""), 10)
    : undefined;
  const paymentUrl = content.match(/https?:\/\/[^\s]+doku[^\s]+/i)?.[0];
  const namaKlien =
    content.match(/Halo,\s*([^!\n]+)/i)?.[1]?.trim() ??
    content.match(/Tagihan Kepada\s+([^\n]+)/i)?.[1]?.trim();
  const itemDeskripsi =
    content.match(/Item:\s*([^\n]+)/i)?.[1]?.trim() ??
    content.match(/Deskripsi\s+([^\n]+)/i)?.[1]?.trim();

  return {
    invoiceNumber,
    namaKlien,
    itemDeskripsi,
    nominalRupiah: Number.isFinite(nominalRupiah)
      ? nominalRupiah
      : undefined,
    paymentUrl,
  };
}

function findLatestInvoiceFromHistory(
  history: { role: "user" | "assistant"; content: string }[],
): StoredInvoice | null {
  const store = loadInvoiceStore();

  for (const entry of history.slice().reverse()) {
    const parsed = parseInvoiceFromText(entry.content);
    if (!parsed?.invoiceNumber) continue;

    const stored = store[parsed.invoiceNumber];
    if (stored) {
      return {
        ...stored,
        namaKlien: stored.namaKlien ?? parsed.namaKlien,
        itemDeskripsi: stored.itemDeskripsi ?? parsed.itemDeskripsi,
        nominalRupiah: stored.nominalRupiah ?? parsed.nominalRupiah,
        paymentUrl: stored.paymentUrl ?? parsed.paymentUrl,
      };
    }

    const now = new Date().toISOString();
    return {
      invoiceNumber: parsed.invoiceNumber,
      status: "PENDING",
      namaKlien: parsed.namaKlien,
      itemDeskripsi: parsed.itemDeskripsi,
      nominalRupiah: parsed.nominalRupiah,
      paymentUrl: parsed.paymentUrl,
      createdAt: now,
      updatedAt: now,
      paidAt: null,
    };
  }

  const latestStored = Object.values(store).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )[0];
  return latestStored ?? null;
}

function buildStatusReply(invoice: StoredInvoice | null): string {
  if (!invoice) {
    return "Saya belum menemukan invoice di percakapan ini. Coba kirim nomor invoice-nya, misalnya INV-462112AB, atau buat tagihan baru dulu.";
  }

  if (invoice.status === "PAID") {
    return [
      `Tagihan ${invoice.invoiceNumber} sudah dibayar.`,
      "",
      `Status: PAID`,
      `Klien: ${invoice.namaKlien ?? "-"}`,
      `Nominal: ${formatRupiah(invoice.nominalRupiah)}`,
      invoice.paidAt ? `Waktu pembayaran: ${invoice.paidAt}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (invoice.status === "FAILED" || invoice.status === "EXPIRED") {
    return [
      `Tagihan ${invoice.invoiceNumber} belum berhasil dibayar.`,
      "",
      `Status: ${invoice.status}`,
      `Klien: ${invoice.namaKlien ?? "-"}`,
      `Nominal: ${formatRupiah(invoice.nominalRupiah)}`,
      "Silakan buat payment link baru jika link sebelumnya sudah tidak bisa dipakai.",
    ].join("\n");
  }

  return [
    `Tagihan ${invoice.invoiceNumber} belum terkonfirmasi dibayar.`,
    "",
    `Status: PENDING`,
    `Klien: ${invoice.namaKlien ?? "-"}`,
    `Nominal: ${formatRupiah(invoice.nominalRupiah)}`,
    "Artinya: PayGent sudah membuat payment link, tetapi belum menerima notifikasi pembayaran sukses dari Doku.",
    "Kalau customer baru saja membayar, tunggu webhook Doku masuk. Untuk demo, status juga bisa dicek di dashboard Doku Sandbox.",
  ].join("\n");
}

function isLikelyClarificationAnswer(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[],
): boolean {
  const text = normalizeIntentText(userMessage);
  const recent = history.slice(-4).map((entry) => normalizeIntentText(entry.content));
  const recentText = recent.join(" ");

  const agentAskedForMissingBillingData =
    recentText.includes("boleh saya tahu") &&
    (recentText.includes("nominal") ||
      recentText.includes("klien") ||
      recentText.includes("untuk apa") ||
      recentText.includes("deskripsi"));

  if (!agentAskedForMissingBillingData) return false;

  return text.length > 0 && !isContextQuestion(text);
}

function shouldEnableDokuCreateTool(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[],
): boolean {
  if (isContextQuestion(userMessage)) return false;

  const text = normalizeIntentText(userMessage);
  return hasCreateBillingIntent(text) || isLikelyClarificationAnswer(userMessage, history);
}

// -- Groq client ---------------------------------------------------------------

const groq = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// -- Agent loop ----------------------------------------------------------------

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
}

async function runAgent(
  userMessage: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
): Promise<string> {
  const enableDokuCreateTool = shouldEnableDokuCreateTool(userMessage, history);
  const messages: ChatMessage[] = [
    { role: "system", content: SKILL_PROMPT },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];

  // Up to 4 tool-call rounds before giving up.
  for (let turn = 0; turn < 4; turn++) {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: messages as never,
      tools: enableDokuCreateTool ? [dokuTool] : undefined,
      tool_choice: enableDokuCreateTool ? "auto" : undefined,
      temperature: 0,
    });

    const choice = completion.choices[0];
    const msg = choice.message;
    const toolCalls = msg.tool_calls ?? [];

    if (toolCalls.length === 0) {
      return msg.content ?? "";
    }

    // Append assistant's tool-call message.
    messages.push({
      role: "assistant",
      content: msg.content ?? "",
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        type: "function",
        function: {
          name: (tc as { function?: { name: string } }).function?.name ?? "",
          arguments:
            (tc as { function?: { arguments: string } }).function?.arguments ??
            "{}",
        },
      })),
    });

    // Execute each tool call.
    for (const tc of toolCalls) {
      const fn = (tc as { function?: { name: string; arguments: string } })
        .function;
      const name = fn?.name ?? "";
      const argsRaw = fn?.arguments ?? "{}";

      let toolOutputText = "";
      if (name === "doku_create_payment_link") {
        let params: DokuPaymentParams;
        try {
          params = JSON.parse(argsRaw) as DokuPaymentParams;
        } catch {
          toolOutputText = "ERROR: Argumen tool tidak valid JSON.";
          messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: toolOutputText,
          });
          continue;
        }

        const result = await executeDokuCreatePaymentLink(params);
        toolOutputText = result.content[0]?.text ?? "";
        saveCreatedInvoiceFromToolOutput(toolOutputText);
      } else {
        toolOutputText = `ERROR: Tool ${name} tidak dikenal.`;
      }

      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: toolOutputText,
      });
    }
  }

  return "Maaf, saya butuh terlalu banyak langkah untuk menyelesaikan permintaan ini. Silakan coba lagi dengan kalimat yang lebih spesifik.";
}

// -- HTTP server ---------------------------------------------------------------

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);

function getHeader(req: express.Request, name: string): string {
  const value = req.header(name);
  return typeof value === "string" ? value : "";
}

function verifyDokuWebhookSignature(
  req: express.Request,
  rawBody: string,
): boolean {
  const clientId = getHeader(req, "Client-Id");
  const requestId = getHeader(req, "Request-Id");
  const requestTimestamp = getHeader(req, "Request-Timestamp");
  const signature = getHeader(req, "Signature");

  if (!clientId || !requestId || !requestTimestamp || !signature) {
    return false;
  }

  const expected = buildDokuSignature({
    clientId,
    secretKey: process.env.DOKU_SECRET_KEY ?? "",
    requestId,
    requestTimestamp,
    requestTarget: req.path,
    bodyStr: rawBody,
  });

  return signature === expected;
}

function mapDokuStatus(status: string | undefined): InvoiceStatus {
  const normalized = status?.toUpperCase();
  if (normalized === "SUCCESS") return "PAID";
  if (normalized === "FAILED") return "FAILED";
  if (normalized === "EXPIRED") return "EXPIRED";
  return "UNKNOWN";
}

app.post(
  "/api/doku/webhook",
  express.raw({ type: "application/json", limit: "256kb" }),
  (req, res) => {
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : "";

    if (process.env.DOKU_WEBHOOK_VERIFY !== "false") {
      const signatureOk = verifyDokuWebhookSignature(req, rawBody);
      if (!signatureOk) {
        res.status(401).json({ ok: false, error: "invalid_signature" });
        return;
      }
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      res.status(400).json({ ok: false, error: "invalid_json" });
      return;
    }

    const order = payload.order as
      | { invoice_number?: string; amount?: number }
      | undefined;
    const transaction = payload.transaction as
      | { status?: string; date?: string }
      | undefined;

    const invoiceNumber = order?.invoice_number?.toUpperCase();
    if (!invoiceNumber) {
      res.status(202).json({ ok: true, ignored: "missing_invoice_number" });
      return;
    }

    const store = loadInvoiceStore();
    const previous = store[invoiceNumber];
    const now = new Date().toISOString();
    const status = mapDokuStatus(transaction?.status);

    upsertInvoice({
      invoiceNumber,
      status,
      namaKlien: previous?.namaKlien,
      itemDeskripsi: previous?.itemDeskripsi,
      nominalRupiah:
        typeof order?.amount === "number"
          ? order.amount
          : previous?.nominalRupiah,
      paymentUrl: previous?.paymentUrl,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
      paidAt: status === "PAID" ? transaction?.date ?? now : previous?.paidAt,
      rawNotification: payload,
    });

    res.json({ ok: true });
  },
);

app.use(express.json({ limit: "256kb" }));

app.get("/", (_req, res) => {
  res.json({
    service: "paygent-autobiller-bridge",
    version: "1.0.0",
    endpoint: "POST /api/message",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", model: GROQ_MODEL });
});

app.post("/api/message", async (req, res) => {
  const userMessage =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!userMessage) {
    res.status(422).json({ message: "Pesan tidak boleh kosong." });
    return;
  }

  // Optional conversation history. Each entry must be { role, content }
  // where role is "user" or "assistant". Anything else is filtered out.
  const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
  const history: { role: "user" | "assistant"; content: string }[] = [];
  for (const entry of rawHistory) {
    if (
      entry &&
      typeof entry === "object" &&
      typeof entry.content === "string" &&
      (entry.role === "user" || entry.role === "assistant")
    ) {
      history.push({ role: entry.role, content: entry.content });
    }
  }
  // Hard cap: last 20 turns (prevents unbounded prompt growth).
  const trimmedHistory = history.slice(-20);

  try {
    if (isPaymentStatusQuestion(userMessage)) {
      const invoice = findLatestInvoiceFromHistory(trimmedHistory);
      res.json({ message: buildStatusReply(invoice) });
      return;
    }

    const reply = await runAgent(userMessage, trimmedHistory);
    res.json({ message: reply });
  } catch (error: unknown) {
    const detail =
      error instanceof Error ? error.message : String(error);
    console.error("[bridge] agent error:", detail);
    res.status(500).json({
      message: `Maaf, terjadi kesalahan internal pada agent. Detail: ${detail}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `[bridge] PayGent OpenClaw bridge listening on http://localhost:${PORT}`,
  );
  console.log(
    `[bridge] model=${GROQ_MODEL} skill=skills/doku-billing/SKILL.md tool=doku_create_payment_link`,
  );
});
