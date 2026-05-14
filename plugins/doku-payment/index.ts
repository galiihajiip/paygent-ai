import { definePluginEntry } from "openclaw/plugin-sdk/core";
import { Type, type Static } from "typebox";

const DokuPaymentParamsSchema = Type.Object({
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

type DokuPaymentParams = Static<typeof DokuPaymentParamsSchema>;

interface DokuPaymentResponse {
  response?: {
    payment?: {
      url?: string;
    };
  };
}

interface DokuToolDetails {
  status: "success" | "failed";
  payment_url?: string;
  invoice_number?: string;
  nama_klien?: string;
  item_deskripsi?: string;
  nominal_rupiah?: number;
  error?: string;
}

function textResult(
  text: string,
  details: DokuToolDetails,
): {
  content: { type: "text"; text: string }[];
  details: DokuToolDetails;
} {
  return {
    content: [{ type: "text", text }],
    details,
  };
}

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
        const params = rawParams as DokuPaymentParams;

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
          Math.random().toString(36).substring(2, 10).toUpperCase();
        const requestId = crypto.randomUUID();
        const timestamp = new Date()
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z");

        const body = {
          order: {
            amount: params.nominal_rupiah,
            invoice_number: invoiceNumber,
            currency: "IDR",
            session_id: crypto.randomUUID(),
          },
          payment: { payment_due_date: 60 },
          customer: {
            name: params.nama_klien,
            email: "billing@paygent.ai",
          },
          line_items: [
            {
              id: "ITEM-001",
              name: params.item_deskripsi,
              price: params.nominal_rupiah,
              quantity: 1,
            },
          ],
        };

        const headers: Record<string, string> = {
          "Client-Id": clientId,
          "Request-Id": requestId,
          "Request-Timestamp": timestamp,
          Signature: `HMACSHA256=${secretKey}`,
          "Content-Type": "application/json",
        };

        try {
          const response = await fetch(`${baseUrl}/checkout/v1/payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
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
          const message =
            error instanceof Error ? error.message : String(error);
          return textResult(
            `ERROR: Gagal terhubung ke Doku API. Detail: ${message}`,
            {
              status: "failed",
              error: message,
            },
          );
        }
      },
    });
  },
});
