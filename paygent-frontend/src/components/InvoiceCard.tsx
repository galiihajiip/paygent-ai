"use client";

import { useRef, useState } from "react";
import { Download, CheckCircle, ExternalLink, Copy, Check } from "lucide-react";

interface InvoiceCardProps {
  namaKlien: string;
  itemDeskripsi: string;
  nominalRupiah: number;
  invoiceNumber: string;
  paymentUrl: string;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function InvoiceCard({
  namaKlien,
  itemDeskripsi,
  nominalRupiah,
  invoiceNumber,
  paymentUrl,
}: InvoiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `invoice-${invoiceNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Gagal mengunduh invoice:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = paymentUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="mt-3 w-full max-w-sm">
      {/* Kartu Invoice — ini yang akan di-screenshot oleh html2canvas */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        {/* Header kartu */}
        <div className="bg-[#2563EB] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#BFDBFE] text-xs font-medium uppercase tracking-wider">
                Invoice
              </p>
              <p className="text-white font-bold text-lg mt-0.5">
                {invoiceNumber}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* Body kartu */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Tagihan Kepada
            </p>
            <p className="text-[#0F172A] font-semibold text-base mt-0.5">
              {namaKlien}
            </p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Deskripsi
            </p>
            <p className="text-[#334155] text-sm mt-0.5">{itemDeskripsi}</p>
          </div>
          <div className="pt-1 border-t border-[#F1F5F9]">
            <p className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Total Tagihan
            </p>
            <p className="text-[#0F172A] font-bold text-2xl mt-0.5">
              {formatRupiah(nominalRupiah)}
            </p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-3">
            <p className="text-[#94A3B8] text-[10px] font-medium uppercase tracking-wider mb-1">
              Link Pembayaran
            </p>
            <p className="text-[#2563EB] text-xs font-medium break-all line-clamp-2">
              {paymentUrl}
            </p>
          </div>
          <div className="pt-1">
            <p className="text-[#94A3B8] text-[10px] text-center">
              ⏰ Berlaku 60 menit · Powered by Doku
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons — di luar ref agar tidak ikut di-screenshot */}
      <div className="flex gap-2 mt-3">
        {/* Tombol Bayar */}
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
        >
          <ExternalLink size={14} />
          Bayar Sekarang
        </a>

        {/* Tombol Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-10 h-10 flex items-center justify-center bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#1E293B] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] rounded-xl transition-colors duration-200"
          title="Copy link"
        >
          {isCopied ? (
            <Check size={16} className="text-[#22C55E]" />
          ) : (
            <Copy size={16} />
          )}
        </button>

        {/* Tombol Download */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-10 h-10 flex items-center justify-center bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-[#1E293B] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#94A3B8] disabled:opacity-50 rounded-xl transition-colors duration-200"
          title="Download invoice"
        >
          {isDownloading ? (
            <svg
              className="animate-spin w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <Download size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
