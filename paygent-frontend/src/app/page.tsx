import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Mic,
  Download,
  Moon,
  ShieldCheck,
} from "lucide-react";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  {
    icon: Sparkles,
    title: "Natural language billing",
    body: "Ketik atau ucapkan satu kalimat — \"Tagihkan PT Maju 2.5 juta untuk konsultasi\" — dan PayGent ubah jadi payment link Doku siap kirim.",
  },
  {
    icon: Mic,
    title: "Voice to invoice",
    body: "Klik mic, bicara Bahasa Indonesia, lepas. Web Speech API ubah suara langsung jadi tagihan tanpa form.",
  },
  {
    icon: Download,
    title: "Download receipt PNG",
    body: "Setiap tagihan datang dengan kartu invoice yang bisa diunduh sebagai gambar untuk dikirim ke klien lewat WhatsApp atau email.",
  },
  {
    icon: ShieldCheck,
    title: "Real Doku Sandbox",
    body: "Bukan mock. Tiap link dibuat lewat HMAC-SHA256 ke endpoint /checkout/v1/payment Doku Sandbox — siap dipromosikan ke production.",
  },
  {
    icon: Moon,
    title: "Dark mode + PWA",
    body: "Tema gelap pakai next-themes (system / light / dark), dan bisa di-install sebagai aplikasi via manifest native Next.js App Router.",
  },
];

const demoPrompts = [
  "Tagihkan PT Kreasi Digital 2.5 juta untuk jasa pembuatan website",
  "Buat invoice untuk Budi Santoso 750 ribu untuk konsultasi 1 jam",
  "Aku mau nagih klien baru, namanya Sarah, untuk desain logo, harganya 500k",
];

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-200">
      <header className="border-b border-[#E2E8F0] dark:border-[#1E293B] bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Logo size={36} showText />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-200 shadow-sm"
            >
              Buka Chat
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[#DBEAFE] dark:bg-[#172554] text-[#1D4ED8] dark:text-[#93C5FD] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-pulse" />
            Powered by OpenClaw × Doku × Groq
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
            Tagih klien dalam{" "}
            <span className="text-[#2563EB] dark:text-[#3B82F6]">
              satu kalimat.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            PayGent adalah asisten AI berbahasa Indonesia yang mengubah satu
            permintaan natural — diketik atau diucapkan — jadi payment link
            Doku siap kirim. Tanpa form, tanpa template, tanpa template Excel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm"
            >
              Coba Sekarang
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://github.com/galiihajiip/paygent-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E2E8F0] dark:border-[#334155] text-sm font-medium px-6 py-3 rounded-xl transition-colors duration-200"
            >
              Lihat Source Code
            </a>
          </div>
        </section>

        {/* Demo prompts */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <p className="text-center text-[#64748B] dark:text-[#94A3B8] text-sm font-medium uppercase tracking-wider mb-4">
            Coba prompt ini
          </p>
          <div className="grid gap-2 sm:gap-3">
            {demoPrompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/chat?prompt=${encodeURIComponent(prompt)}`}
                className="group bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#2563EB] dark:hover:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors duration-200 flex items-center justify-between gap-3"
              >
                <span className="flex-1">&quot;{prompt}&quot;</span>
                <ArrowRight
                  size={14}
                  className="text-[#94A3B8] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] flex-shrink-0 transition-colors"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 sm:p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] dark:bg-[#172554] flex items-center justify-center mb-4">
                  <Icon
                    size={20}
                    className="text-[#2563EB] dark:text-[#93C5FD]"
                  />
                </div>
                <h3 className="text-[#0F172A] dark:text-[#F1F5F9] font-semibold text-base mb-1.5">
                  {title}
                </h3>
                <p className="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 sm:p-8">
            <p className="text-center text-[#64748B] dark:text-[#94A3B8] text-sm font-medium uppercase tracking-wider mb-6">
              How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  step: "01",
                  title: "Type or speak",
                  body: "Sebut nama klien, deskripsi, dan nominal di chat — atau pakai mic.",
                },
                {
                  step: "02",
                  title: "OpenClaw skill",
                  body: "skills/doku-billing/SKILL.md mengarahkan agent kapan dan bagaimana memanggil tool.",
                },
                {
                  step: "03",
                  title: "Doku payment link",
                  body: "Plugin TypeScript memanggil Doku Sandbox dengan HMAC-SHA256, balas link siap pakai.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <p className="text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold tracking-wider mb-2">
                    {step}
                  </p>
                  <h4 className="text-[#0F172A] dark:text-[#F1F5F9] font-semibold text-sm mb-1">
                    {title}
                  </h4>
                  <p className="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <p>© 2026 PayGent · Doku Sandbox · OpenClaw artifacts</p>
          <p className="font-medium">
            Built with Next.js 16 · Tailwind 4 · Groq LLaMA-3.3 70B
          </p>
        </div>
      </footer>
    </div>
  );
}
