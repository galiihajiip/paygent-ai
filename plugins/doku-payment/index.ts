import { definePluginEntry } from "openclaw/plugin-sdk/core";
import { Type, type Static } from "typebox";
import { createHash, createHmac } from "node:crypto";

export const DokuPaymentParamsSchema = Type.Object({
  nama_klien: Type.String({
    description: "Nama lengkap klien yang akan ditagih",
  }),
  item_deskripsi: Type.String({
    description: "Deskripsi item atau jasa yang ditagihkan",
  }),
  nominal_rupiah: Type.Number({
    description:
      "Jumlah tagihan dalam Rupiah (contoh: 1500000 untuk 1.5 juta)",
  }),
});

export type DokuPaymentParams = Static<typeof DokuPaymentParamsSchema>;

interface DokuPaymentResponse {
  response?: {
    payment?: {
      url?: string;
    };
  };
}

export interface DokuToolDetails {
  status: "success" | "failed";
  payment_url?: string;
  invoice_number?: string;
  nama_klien?: string;
  item_deskripsi?: string;
  nominal_rupiah?: number;
  error?: string;
}

export interface DokuToolResult {
  content: { type: "text"; text: string }[];
  details: DokuToolDetails;
}

function textResult(text: string, details: DokuToolDetails): DokuToolResult {
  return {
    content: [{ type: "text", text }],
    details,
  };
}

/**
 * Build Doku HMAC-SHA256 signature header value.
 *
 * Mirrors the working Python implementation in paygent-backend/tools/doku_tool.py.
 * Reference: https://developers.doku.com/getting-started-with-doku-api/signature-component/non-snap/sample-code
 *
 * Component (newline-separated, no trailing newline):
 *   Client-Id:<client_id>
 *   Request-Id:<request_id>
 *   Request-Timestamp:<request_timestamp>
 *   Request-Target:<request_target>
 *   Digest:<base64(sha256(body_str))>
 *
 * IMPORTANT: body_str must be the EXACT same string sent over the wire.
 */
export function buildDokuSignature(args: {
  clientId: string;
  secretKey: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  bodyStr: string;
}): string {
  const digest = createHash("sha256")
    .update(args.bodyStr, "utf8")
    .digest("base64");

  const component =
    `Client-Id:${args.clientId}\n` +
    `Request-Id:${args.requestId}\n` +
    `Request-Timestamp:${args.requestTimestamp}\n` +
    `Request-Target:${args.requestTarget}\n` +
    `Digest:${digest}`;

  const signatureB64 = createHmac("sha256", args.secretKey)
    .update(component, "utf8")
    .digest("base64");

  return `HMACSHA256=${signatureB64}`;
}

/**
 * Execute the Doku create-payment-link tool. This is the canonical implementation
 * that both the OpenClaw plugin entry and the bridge server share.
 */
export async function executeDokuCreatePaymentLink(
  params: DokuPaymentParams,
): Promise<DokuToolResult> {
  const clientId = process.env.DOKU_CLIENT_ID ?? "";
  const secretKey = process.env.DOKU_SECRET_KEY ?? "";
  const baseUrl =
    process.env.DOKU_BASE_URL ?? "https://api-sandbox.doku.com";

  if (!clientId || !secretKey) {
    return textResult(
      "ERROR: DOKU_CLIENT_ID atau DOKU_SECRET_KEY belum dikonfigurasi di environment variables.",
      {
        status: "failed",
        error: "missing_credentials",
      },
    );
  }

  const invoiceNumber =
    "INV-" +
    crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date()
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
  const requestTarget = "/checkout/v1/payment";

  const body = {
    order: {
      amount: params.nominal_rupiah,
      invoice_number: invoiceNumber,
      currency: "IDR",
      line_items: [
        {
          id: "ITEM-001",
          name: params.item_deskripsi,
          price: params.nominal_rupiah,
          quantity: 1,
        },
      ],
    },
    payment: { payment_due_date: 60 },
    customer: {
      id: "PAYGENT-CUST-001",
      name: params.nama_klien,
      email: "billing@paygent.ai",
    },
  };

  // Serialize body ONCE — same exact bytes are used for digest and HTTP request.
  const bodyStr = JSON.stringify(body);

  const signature = buildDokuSignature({
    clientId,
    secretKey,
    requestId,
    requestTimestamp,
    requestTarget,
    bodyStr,
  });

  const headers: Record<string, string> = {
    "Client-Id": clientId,
    "Request-Id": requestId,
    "Request-Timestamp": requestTimestamp,
    Signature: signature,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${baseUrl}${requestTarget}`, {
      method: "POST",
      headers,
      body: bodyStr,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return textResult(
        `ERROR: Doku API mengembalikan status ${response.status}. Detail: ${errorText}`,
        {
          status: "failed",
          error: `http_${response.status}`,
        },
      );
    }

    const data = (await response.json()) as DokuPaymentResponse;
    const paymentUrl = data?.response?.payment?.url;

    if (!paymentUrl) {
      return textResult(
        "ERROR: Struktur response Doku tidak dikenal. Field response.payment.url tidak ditemukan.",
        {
          status: "failed",
          error: "unexpected_response_shape",
        },
      );
    }

    const successPayload = {
      success: true,
      payment_url: paymentUrl,
      invoice_number: invoiceNumber,
      nama_klien: params.nama_klien,
      item_deskripsi: params.item_deskripsi,
      nominal_rupiah: params.nominal_rupiah,
    };

    return textResult(JSON.stringify(successPayload), {
      status: "success",
      payment_url: paymentUrl,
      invoice_number: invoiceNumber,
      nama_klien: params.nama_klien,
      item_deskripsi: params.item_deskripsi,
      nominal_rupiah: params.nominal_rupiah,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return textResult(
      `ERROR: Gagal terhubung ke Doku API. Detail: ${message}`,
      {
        status: "failed",
        error: message,
      },
    );
  }
}

/**
 * OpenClaw plugin entry. Used by the OpenClaw Gateway when running with the full
 * harness. The bridge server in paygent-openclaw/server/bridge.ts invokes
 * `executeDokuCreatePaymentLink` directly with the same schema and parameters.
 */
export default definePluginEntry({
  id: "doku-payment",
  name: "Doku Payment Gateway",
  description:
    "Membuat payment link Doku Sandbox untuk penagihan klien via AI agent",
  register(api) {
    api.registerTool({
      name: "doku_create_payment_link",
      label: "Doku: Buat Payment Link",
      description:
        "Gunakan tool ini untuk membuat payment link Doku ketika user meminta untuk menagih seseorang. Ekstrak nama_klien, item_deskripsi, dan nominal_rupiah dari permintaan user.",
      parameters: DokuPaymentParamsSchema,
      async execute(_toolCallId, rawParams) {
        return executeDokuCreatePaymentLink(rawParams as DokuPaymentParams);
      },
    });
  },
});
