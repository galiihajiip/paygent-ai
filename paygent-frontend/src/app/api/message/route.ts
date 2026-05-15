import { NextResponse, NextRequest } from "next/server";
import { join } from "path";
import { tmpdir } from "os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import {
  executeDokuCreatePaymentLink,
  buildDokuSignature,
  type DokuPaymentParams,
} from "@paygent/openclaw-doku-payment";

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

// Note: On Vercel, /tmp is the only writable directory, and it gets cleared on cold starts.
// For a production app, use a real database (PostgreSQL, Vercel KV, Supabase, etc).
const INVOICE_STORE_PATH = join(tmpdir(), "openclaw-invoices.json");

const SKILL_PROMPT = `
Kamu adalah PayGent, asisten AI penagihan profesional untuk freelancer dan UMKM Indonesia.

Tugas utama kamu adalah membantu user membuat tagihan dan payment link Doku dari bahasa natural. Kamu harus bersikap hangat, ringkas, sopan, dan akurat.

## Entitas Wajib Untuk Membuat Tagihan
Sebelum memanggil tool Doku API, kamu WAJIB memastikan 3 data berikut sudah tersedia:
1. Nama Klien
2. Nama Item atau Deskripsi Jasa
3. Nominal Harga dalam Rupiah

## Aturan Paling Penting
Jika user meminta dibuatkan tagihan, invoice, payment link, atau bill, tetapi salah satu dari 3 entitas wajib belum disebutkan, JANGAN panggil tool Doku API. Sebagai gantinya, tanyakan hanya data yang kurang dengan bahasa yang sopan dan natural.

## Memori Percakapan
Gunakan informasi dari pesan-pesan sebelumnya. Jika user sudah menyebut nama klien di pesan sebelumnya, jangan minta ulang nama klien. Gabungkan data lama dan data baru.

## Panggilan Tool
Panggil tool doku_create_payment_link hanya jika data di atas lengkap.
`;

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
    return JSON.parse(readFileSync(INVOICE_STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveInvoiceStore(store: Record<string, StoredInvoice>) {
  try {
    writeFileSync(INVOICE_STORE_PATH, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error("Failed writing invoice store to /tmp", err);
  }
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
    if (parsed.success !== true || typeof parsed.invoice_number !== "string") {
      return;
    }
    const now = new Date().toISOString();
    upsertInvoice({
      invoiceNumber: parsed.invoice_number,
      status: "PENDING",
      namaKlien: typeof parsed.nama_klien === "string" ? parsed.nama_klien : undefined,
      itemDeskripsi: typeof parsed.item_deskripsi === "string" ? parsed.item_deskripsi : undefined,
      nominalRupiah: typeof parsed.nominal_rupiah === "number" ? parsed.nominal_rupiah : undefined,
      paymentUrl: typeof parsed.payment_url === "string" ? parsed.payment_url : undefined,
      createdAt: now,
      updatedAt: now,
      paidAt: null,
    });
  } catch {}
}

const dokuTool = {
  type: "function" as const,
  function: {
    name: "doku_create_payment_link",
    description: "Buat payment link Doku ketika user meminta menagih seseorang. Ekstrak nama_klien, item_deskripsi, dan nominal_rupiah.",
    parameters: {
      type: "object",
      properties: {
        nama_klien: { type: "string", description: "Nama klien" },
        item_deskripsi: { type: "string", description: "Deskripsi item" },
        nominal_rupiah: { type: "number", description: "Jumlah tagihan Rupiah murni" },
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
  return [
    /\b(sudah|udah|telah)\s+(di)?bayar\b/,
    /\b(belum|blm)\s+(di)?bayar\b/,
    /\bpaid\b|\bunpaid\b|\bstatus\b/,
    /\bcek\b.*\b(pembayaran|bayar|status)\b/,
    /\btahu\b.*\b(dibayar|bayar|status)\b/
  ].some((pattern) => pattern.test(text));
}

function isPaymentStatusQuestion(userMessage: string): boolean {
  return isContextQuestion(userMessage);
}

function hasCreateBillingIntent(text: string): boolean {
  return ["tagih", "buat tagihan", "buat invoice", "link pembayaran"].some((phrase) => text.includes(phrase));
}

function formatRupiah(amount?: number): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function parseInvoiceFromText(content: string): Partial<StoredInvoice> | null {
  const invoiceNumber = content.match(/INV-[A-Z0-9]+/i)?.[0]?.toUpperCase();
  if (!invoiceNumber) return null;
  const nominalText = content.match(/Rp\s*([\d.,]+)/i)?.[1];
  const nominalRupiah = nominalText ? Number.parseInt(nominalText.replace(/[.,]/g, ""), 10) : undefined;
  return { invoiceNumber, nominalRupiah };
}

function findLatestInvoiceFromHistory(history: { role: "user" | "assistant"; content: string }[]): StoredInvoice | null {
  const store = loadInvoiceStore();
  for (const entry of history.slice().reverse()) {
    const parsed = parseInvoiceFromText(entry.content);
    if (parsed?.invoiceNumber && store[parsed.invoiceNumber]) return store[parsed.invoiceNumber];
  }
  const latestStored = Object.values(store).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return latestStored ?? null;
}

function buildStatusReply(invoice: StoredInvoice | null): string {
  if (!invoice) return "Saya belum menemukan invoice di percakapan ini. Coba buat tagihan baru dulu.";
  if (invoice.status === "PAID") return `Tagihan ${invoice.invoiceNumber} sudah dibayar.\nStatus: PAID\nNominal: ${formatRupiah(invoice.nominalRupiah)}`;
  if (invoice.status === "FAILED" || invoice.status === "EXPIRED") return `Tagihan ${invoice.invoiceNumber} gagal/kedaluwarsa.`;
  return `Tagihan ${invoice.invoiceNumber} masih PENDING.\nTunggu webhook Doku masuk.`;
}

function shouldEnableDokuCreateTool(userMessage: string): boolean {
  if (isContextQuestion(userMessage)) return false;
  return true; // Simplified: usually keep it enabled unless it's a direct info question
}

export async function POST(req: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ message: "GROQ_API_KEY missing in environment variables" }, { status: 500 });
  }

  const groq = new OpenAI({ apiKey: GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
  
  try {
    const body = await req.json();
    const userMessage = typeof body?.message === "string" ? body.message.trim() : "";
    if (!userMessage) return NextResponse.json({ message: "Pesan tidak boleh kosong." }, { status: 422 });

    const rawHistory = Array.isArray(body?.history) ? body.history : [];
    const history: { role: "user" | "assistant"; content: string }[] = rawHistory
      .filter((e: any) => typeof e?.content === "string" && (e.role === "user" || e.role === "assistant"))
      .slice(-20);

    if (isPaymentStatusQuestion(userMessage)) {
      const invoice = findLatestInvoiceFromHistory(history);
      return NextResponse.json({ message: buildStatusReply(invoice) });
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SKILL_PROMPT },
      ...history,
      { role: "user", content: userMessage },
    ];

    let reply = "Pesan gagal direspon.";
    for (let turn = 0; turn < 4; turn++) {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: messages as any,
        tools: shouldEnableDokuCreateTool(userMessage) ? [dokuTool] : undefined,
        tool_choice: shouldEnableDokuCreateTool(userMessage) ? "auto" : undefined,
        temperature: 0,
      });

      const msg = completion.choices[0].message;
      const toolCalls = msg.tool_calls;

      if (!toolCalls || toolCalls.length === 0) {
        reply = msg.content || "";
        break;
      }

      messages.push(msg);

      for (const tc of toolCalls) {
        let toolOutputText = "";
        if (tc.function.name === "doku_create_payment_link") {
          let params: DokuPaymentParams;
          try {
            params = JSON.parse(tc.function.arguments);
            const result = await executeDokuCreatePaymentLink(params);
            toolOutputText = result.content[0]?.text ?? "";
            saveCreatedInvoiceFromToolOutput(toolOutputText);
          } catch {
            toolOutputText = "ERROR: Argumen invalid JSON.";
          }
        }
        messages.push({ role: "tool", tool_call_id: tc.id, content: toolOutputText } as any);
      }
    }

    return NextResponse.json({ message: reply });
  } catch (error: any) {
    console.error("[Next API] agent error:", error);
    return NextResponse.json({ message: `Kesalahan internal: ${error.message}` }, { status: 500 });
  }
}
