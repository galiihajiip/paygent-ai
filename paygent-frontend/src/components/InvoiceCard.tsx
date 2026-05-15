"use client";

import { useRef, useState } from "react";
import {
  BellRing,
  Check,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";

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
    maximumFractionDigits: 0,
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
  const [paymentStatus, setPaymentStatus] = useState<"PENDING" | "PAID">(
    "PENDING",
  );
  const [showToast, setShowToast] = useState(false);

  const isPaid = paymentStatus === "PAID";
  const formattedNominal = formatRupiah(nominalRupiah);

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
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = paymentUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSimulateWebhook = () => {
    if (isPaid) return;

    setPaymentStatus("PAID");
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 4500);
  };

  return (
    <div className="mt-3 w-full max-w-sm">
      {showToast && (
        <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 text-[#0F172A] shadow-2xl transition-all duration-300 dark:border-emerald-900 dark:bg-[#0F172A] dark:text-[#F8FAFC]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                WhatsApp Automation
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug">
                PayGent: Pembayaran {formattedNominal} dari {namaKlien} telah
                diterima.
              </p>
              <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                Auto-confirmed by Doku webhook
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        ref={cardRef}
        className={
          "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 " +
          (isPaid
            ? "border-emerald-300 ring-4 ring-emerald-100"
            : "border-[#E2E8F0]")
        }
      >
        <div
          className={
            "px-5 py-4 transition-colors duration-500 " +
            (isPaid ? "bg-emerald-600" : "bg-[#2563EB]")
          }
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                Invoice
              </p>
              <p className="mt-0.5 text-lg font-bold text-white">
                {invoiceNumber}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <CheckCircle className="text-white" size={20} />
              </div>
              <span
                className={
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors duration-500 " +
                  (isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700")
                }
              >
                {isPaid ? "PAID (Lunas)" : "PENDING"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
              Tagihan Kepada
            </p>
            <p className="mt-0.5 text-base font-semibold text-[#0F172A]">
              {namaKlien}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
              Deskripsi
            </p>
            <p className="mt-0.5 text-sm text-[#334155]">{itemDeskripsi}</p>
          </div>
          <div className="border-t border-[#F1F5F9] pt-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
              Total Tagihan
            </p>
            <p className="mt-0.5 text-2xl font-bold text-[#0F172A]">
              {formattedNominal}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-3">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
              Link Pembayaran
            </p>
            <p className="line-clamp-2 break-all text-xs font-medium text-[#2563EB]">
              {paymentUrl}
            </p>
          </div>
          <div className="pt-1">
            <p className="text-center text-[10px] text-[#94A3B8]">
              Berlaku 60 menit - Powered by Doku
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 " +
            (isPaid
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6]")
          }
        >
          <ExternalLink size={14} />
          Bayar Sekarang
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B] transition-colors duration-200 hover:bg-[#E2E8F0] dark:bg-[#1E293B] dark:text-[#94A3B8] dark:hover:bg-[#334155]"
          title="Copy link"
        >
          {isCopied ? (
            <Check size={16} className="text-[#22C55E]" />
          ) : (
            <Copy size={16} />
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B] transition-colors duration-200 hover:bg-[#E2E8F0] disabled:opacity-50 dark:bg-[#1E293B] dark:text-[#94A3B8] dark:hover:bg-[#334155]"
          title="Download invoice"
        >
          {isDownloading ? (
            <svg
              className="h-4 w-4 animate-spin"
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

      <button
        type="button"
        onClick={handleSimulateWebhook}
        disabled={isPaid}
        title="Mock Doku webhook success event"
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#64748B] transition-colors duration-200 hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-700 dark:border-[#334155] dark:bg-[#111827] dark:text-[#94A3B8] dark:hover:bg-[#1E293B] dark:disabled:border-emerald-900 dark:disabled:bg-emerald-950 dark:disabled:text-emerald-300"
      >
        <BellRing size={14} />
        {isPaid ? "Webhook Received" : "[Dev] Simulate Webhook"}
      </button>
    </div>
  );
}
