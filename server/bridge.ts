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
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { config as loadDotenv } from "dotenv";
import {
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

if (!GROQ_API_KEY) {
  console.error(
    "[bridge] FATAL: GROQ_API_KEY missing. Set it in paygent-openclaw/.env",
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

async function runAgent(userMessage: string): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: SKILL_PROMPT },
    { role: "user", content: userMessage },
  ];

  // Up to 4 tool-call rounds before giving up.
  for (let turn = 0; turn < 4; turn++) {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: messages as never,
      tools: [dokuTool],
      tool_choice: "auto",
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
app.use(express.json({ limit: "256kb" }));

app.get("/", (_req, res) => {
  res.json({
    service: "paygent-openclaw-bridge",
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

  try {
    const reply = await runAgent(userMessage);
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
