"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  Home,
  MessageSquareText,
  TrendingUp,
  Wallet,
} from "lucide-react";

const kpis = [
  {
    label: "Total Pendapatan Bulan Ini",
    value: "Rp 15.000.000",
    caption: "+28% dari bulan lalu",
    accent: "emerald",
    icon: TrendingUp,
  },
  {
    label: "Outstanding Invoice",
    value: "Rp 4.500.000",
    caption: "5 invoice belum lunas",
    accent: "amber",
    icon: Clock3,
  },
  {
    label: "Paid This Week",
    value: "Rp 7.250.000",
    caption: "12 pembayaran sukses",
    accent: "blue",
    icon: Wallet,
  },
];

const latePayments = [
  { client: "PT Kreasi Digital", days: "12 hari telat", width: "90%" },
  { client: "CV Sentosa Media", days: "8 hari telat", width: "65%" },
  { client: "Budi Santoso", days: "5 hari telat", width: "45%" },
  { client: "SMA Negeri 1 Surakarta", days: "2 hari telat", width: "25%" },
];

const invoiceRows = [
  {
    client: "PT Kreasi Digital",
    invoice: "INV-2026-041",
    amount: "Rp 2.500.000",
    status: "Late",
    automation: "WhatsApp reminder ready",
  },
  {
    client: "CV Sentosa Media",
    invoice: "INV-2026-039",
    amount: "Rp 1.500.000",
    status: "Pending",
    automation: "Waiting for Doku webhook",
  },
  {
    client: "SMA Negeri 1 Surakarta",
    invoice: "INV-2026-038",
    amount: "Rp 400.000",
    status: "Paid",
    automation: "Auto-confirmed by webhook",
  },
  {
    client: "Budi Santoso",
    invoice: "INV-2026-037",
    amount: "Rp 100.000",
    status: "Paid",
    automation: "Receipt sent",
  },
];

function statusClass(status: string) {
  if (status === "Paid") {
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
  }
  if (status === "Late") {
    return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";
  }
  return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
}

function kpiStyles(accent: string) {
  if (accent === "emerald") {
    return {
      icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      ring: "border-emerald-200 dark:border-emerald-900",
    };
  }
  if (accent === "amber") {
    return {
      icon: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      ring: "border-amber-200 dark:border-amber-900",
    };
  }
  return {
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    ring: "border-blue-200 dark:border-blue-900",
  };
}

export default function DashboardPage() {
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-[#F8FAFC] px-4 py-5 text-[#0F172A] transition-colors dark:bg-[#0B1120] dark:text-[#F8FAFC] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#1E293B] dark:bg-[#0F172A] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
              <Bot size={14} />
              Vision Mockup
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC] sm:text-4xl">
              AI CFO Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8] sm:text-base">
              Revenue intelligence, invoice health, and autonomous follow-up
              insights.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-[#F1F5F9] dark:border-[#334155] dark:bg-[#1E293B] dark:text-[#CBD5E1] dark:hover:bg-[#334155]"
            >
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              <ArrowLeft size={16} />
              Chat Assistant
            </Link>
          </nav>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {kpis.map(({ label, value, caption, accent, icon: Icon }) => {
            const styles = kpiStyles(accent);
            return (
              <article
                key={label}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 dark:bg-[#0F172A] ${styles.ring}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">
                      {label}
                    </p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
                      {value}
                    </p>
                    <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                      {caption}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#1E293B] dark:bg-[#0F172A] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  <BarChart3 size={20} className="text-orange-500" />
                  Late-Payment Analytics
                </h2>
                <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Klien dengan rata-rata keterlambatan pembayaran tertinggi.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {latePayments.map((item) => (
                <div key={item.client}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-[#334155] dark:text-[#CBD5E1]">
                      {item.client}
                    </span>
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                      {item.days}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-[#1E293B]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-5 shadow-sm dark:border-blue-900 dark:from-blue-950 dark:via-[#0F172A] dark:to-emerald-950 sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Bot size={22} />
            </div>
            <h2 className="text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              CFO Recommendations
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
              Terdapat 3 tagihan terlambat dari PT Kreasi.
            </p>
            <p className="mt-2 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Rekomendasi: Kirim Smart Follow-Up sekarang.
            </p>
            <button
              type="button"
              onClick={() => setShowFollowUp((value) => !value)}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              <MessageSquareText size={16} />
              Generate Follow-Up Message
            </button>

            {showFollowUp && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-white/80 p-4 text-sm leading-relaxed text-[#334155] shadow-sm dark:border-emerald-900 dark:bg-[#0B1120]/80 dark:text-[#CBD5E1]">
                Halo PT Kreasi Digital, kami ingin mengingatkan bahwa invoice
                INV-2026-041 masih menunggu pembayaran. Silakan lakukan
                pembayaran melalui link yang sudah dikirim. Terima kasih.
              </div>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm dark:border-[#1E293B] dark:bg-[#0F172A]">
          <div className="border-b border-[#E2E8F0] p-5 dark:border-[#1E293B] sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              <CheckCircle2 size={20} className="text-emerald-500" />
              Recent Invoice Activity
            </h2>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Mock activity stream for webhook and WhatsApp automation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B] dark:bg-[#0B1120] dark:text-[#94A3B8]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Automation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                {invoiceRows.map((row) => (
                  <tr key={row.invoice} className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#111827]">
                    <td className="px-5 py-4 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                      {row.client}
                    </td>
                    <td className="px-5 py-4 text-[#64748B] dark:text-[#94A3B8]">
                      {row.invoice}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {row.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#64748B] dark:text-[#94A3B8]">
                      {row.automation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="py-6 text-center text-xs text-[#94A3B8] dark:text-[#64748B]">
          Mock dashboard for PayGent roadmap demo - no backend calls.
        </p>
      </div>
    </main>
  );
}
