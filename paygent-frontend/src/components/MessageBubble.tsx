"use client";

import React from "react";
import InvoiceCard from "./InvoiceCard";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

interface InvoiceData {
  namaKlien: string;
  itemDeskripsi: string;
  nominalRupiah: number;
  invoiceNumber: string;
  paymentUrl: string;
}

function tryParseInvoiceData(content: string): InvoiceData | null {
  // Coba parse JSON langsung (untuk OpenClaw yang return JSON)
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (
      parsed.success === true &&
      typeof parsed.payment_url === "string" &&
      typeof parsed.nama_klien === "string"
    ) {
      return {
        namaKlien: parsed.nama_klien as string,
        itemDeskripsi: parsed.item_deskripsi as string,
        nominalRupiah: parsed.nominal_rupiah as number,
        invoiceNumber: parsed.invoice_number as string,
        paymentUrl: parsed.payment_url as string,
      };
    }
  } catch {
    // Bukan JSON, lanjut ke pattern matching
  }

  // Pattern matching untuk pesan natural language yang mengandung URL Doku
  const urlMatch = content.match(/https?:\/\/[^\s]+doku[^\s]+/i);
  const invoiceMatch = content.match(/INV-[A-Z0-9]+/i);
  const nominalMatch = content.match(/Rp\s*([\d.,]+)/i);

  if (urlMatch) {
    // Extract nominal
    let nominal = 0;
    if (nominalMatch) {
      nominal = parseInt(nominalMatch[1].replace(/[.,]/g, ""), 10);
      if (isNaN(nominal)) nominal = 0;
    }

    // Extract nama klien (teks setelah "Halo" atau "kepada")
    const namaMatch =
      content.match(/(?:Halo[,!]?\s*\*?\*?)([^!,\n]+)/i) ??
      content.match(/(?:kepada\s+)([^\s,!.]+(?:\s+[^\s,!.]+)?)/i);

    return {
      namaKlien:
        namaMatch?.[1]?.trim().replace(/[*\s]+$/g, "") ?? "Klien",
      itemDeskripsi: "Lihat detail di payment link",
      nominalRupiah: nominal,
      invoiceNumber:
        invoiceMatch?.[0] ?? "INV-" + Date.now().toString(36).toUpperCase(),
      paymentUrl: urlMatch[0],
    };
  }

  return null;
}

function formatContent(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Reset lastIndex because regex has /g flag and is reused via .test()
      urlRegex.lastIndex = 0;
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-2 underline-offset-2 text-[#2563EB] hover:text-[#1D4ED8] transition-colors break-all"
        >
          🔗 Bayar Sekarang
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] bg-[#0F172A] dark:bg-[#2563EB] text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
          {formatContent(content)}
        </div>
      </div>
    );
  }

  // Coba parse invoice data jika ini adalah pesan assistant
  const invoiceData = tryParseInvoiceData(content);

  if (invoiceData) {
    return (
      <div className="flex justify-start items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0 mt-1">
          PG
        </div>
        <div className="max-w-[90%] sm:max-w-sm">
          <p className="text-[#0F172A] dark:text-[#F1F5F9] text-sm mb-2 leading-relaxed">
            ✅ Tagihan berhasil dibuat! Berikut detailnya:
          </p>
          <InvoiceCard {...invoiceData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
        PG
      </div>
      <div className="max-w-[75%] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F1F5F9] px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">
        {formatContent(content)}
      </div>
    </div>
  );
}
