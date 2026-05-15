import { NextResponse, NextRequest } from "next/server";
import { join } from "path";
import { tmpdir } from "os";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { buildDokuSignature } from "@paygent/openclaw-doku-payment";

const INVOICE_STORE_PATH = join(tmpdir(), "openclaw-invoices.json");

function loadInvoiceStore() {
  if (!existsSync(INVOICE_STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(INVOICE_STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveInvoiceStore(store: any) {
  try {
    writeFileSync(INVOICE_STORE_PATH, JSON.stringify(store, null, 2));
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (process.env.DOKU_WEBHOOK_VERIFY !== "false") {
      const clientId = req.headers.get("Client-Id") || "";
      const requestId = req.headers.get("Request-Id") || "";
      const requestTimestamp = req.headers.get("Request-Timestamp") || "";
      const signature = req.headers.get("Signature") || "";

      if (!clientId || !requestId || !requestTimestamp || !signature) {
        return NextResponse.json({ ok: false, error: "invalid_signature_headers" }, { status: 401 });
      }

      // get absolute path for signature target as in express req.path
      const url = new URL(req.url);
      const requestTarget = url.pathname;

      const expected = buildDokuSignature({
        clientId,
        secretKey: process.env.DOKU_SECRET_KEY ?? "",
        requestId,
        requestTimestamp,
        requestTarget,
        bodyStr: rawBody,
      });

      if (signature !== expected) {
        return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const order = payload.order || {};
    const transaction = payload.transaction || {};

    const invoiceNumber = order.invoice_number?.toUpperCase();
    if (!invoiceNumber) {
      return NextResponse.json({ ok: true, ignored: "missing_invoice_number" }, { status: 202 });
    }

    const store = loadInvoiceStore();
    const previous = store[invoiceNumber];
    const now = new Date().toISOString();
    
    let status = "UNKNOWN";
    const mapped = transaction.status?.toUpperCase();
    if (mapped === "SUCCESS") status = "PAID";
    else if (mapped === "FAILED") status = "FAILED";
    else if (mapped === "EXPIRED") status = "EXPIRED";

    store[invoiceNumber] = {
      ...previous,
      invoiceNumber,
      status,
      namaKlien: previous?.namaKlien,
      itemDeskripsi: previous?.itemDeskripsi,
      nominalRupiah: typeof order.amount === "number" ? order.amount : previous?.nominalRupiah,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
      paidAt: status === "PAID" ? (transaction.date ?? now) : previous?.paidAt,
    };
    saveInvoiceStore(store);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "invalid_json_or_internal_error" }, { status: 400 });
  }
}