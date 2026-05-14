# PayGent OpenClaw Edition

### Auto-Biller AI · Powered by Doku Payment Gateway × OpenClaw Agent Framework

PayGent adalah asisten AI berbahasa Indonesia yang mengubah satu kalimat natural language ("tolong tagihkan PT Maju Bersama 2.5 juta untuk jasa konsultasi bisnis") menjadi payment link Doku yang siap dikirim ke klien. Edisi OpenClaw ini membongkar dependensi backend kustom dan membangun ulang agent di atas OpenClaw Gateway, dengan Doku terintegrasi sebagai TypeScript plugin resmi dan workflow penagihan dideklarasikan via SKILL.md.

---

## Architecture

```
User (Natural Language)
        │
        ▼
Next.js Frontend (port 3000)
        │  iframe / REST API
        ▼
OpenClaw Gateway (port 3001)
        │
        ├─── SKILL: doku-billing/SKILL.md
        │    (mengajarkan agent kapan & bagaimana menagih)
        │
        ├─── PLUGIN: @paygent/openclaw-doku-payment
        │    (memanggil Doku Sandbox API secara nyata)
        │
        └─── MODEL: Groq LLaMA-3 70B
             (reasoning engine via ReAct loop)
                    │
                    ▼
           Doku Sandbox API
           /checkout/v1/payment
                    │
                    ▼
           Payment Link URL
           dikembalikan ke user
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Akun Groq dengan API key (https://console.groq.com)
- Akun Doku Sandbox dengan Client ID dan Secret Key (https://sandbox.doku.com)

### 1. Clone repo

```bash
git clone https://github.com/galiihajiip/paygent-ai.git
cd paygent-ai
```

### 2. Install OpenClaw CLI

```bash
npm install -g openclaw
```

### 3. Konfigurasi credentials

```bash
cp .env.example .env
# Buka .env dan isi GROQ_API_KEY, DOKU_CLIENT_ID, DOKU_SECRET_KEY
```

### 4. Build Doku payment plugin

```bash
cd plugins/doku-payment
npm install
npm run build
cd ../..
```

### 5. Jalankan PayGent OpenClaw Bridge

```bash
cd server
npm install
npm start
```

Bridge akan berjalan di port 3001. Bridge memuat `skills/doku-billing/SKILL.md` sebagai system prompt dan menjalankan `executeDokuCreatePaymentLink` dari plugin TypeScript secara langsung — kode yang sama persis yang juga didaftarkan ke OpenClaw Gateway via `definePluginEntry` di `plugins/doku-payment/index.ts`.

> **Catatan teknis.** OpenClaw 2026.5.7 menyertakan embedded harness yang menyuntikkan ~30 ribu token konteks per turn, melebihi limit Groq free-tier. Bridge ini adalah runner ringan untuk artefak OpenClaw yang sama (SKILL.md + plugin tool) sehingga demo bisa berjalan di environment dengan TPM terbatas. Lihat `docs/OC-3.1-test.md` untuk hasil verifikasi end-to-end (3 skenario, 3 payment link Doku Sandbox real).

### 6. Jalankan Next.js frontend

Di terminal terpisah:

```bash
cd paygent-frontend
npm install
npm run dev
```

### 7. Buka aplikasi

Akses `http://localhost:3000` di browser. Frontend akan terhubung ke bridge di `http://localhost:3001/api/message` dan menampilkan chat UI custom (`src/components/ChatWindow.tsx`).

---

## Demo Script

Tiga skenario yang bisa diuji langsung di chat:

### Skenario 1 — Penagihan korporat dengan format nominal "juta"

> **User:** Tagihkan PT Kreasi Digital 2.5 juta untuk jasa pembuatan website
>
> **PayGent:**
> ✅ **Tagihan berhasil dibuat!**
>
> Halo, **PT Kreasi Digital**! 😊
>
> | Detail | Informasi |
> |--------|-----------|
> | 📋 Item | Jasa pembuatan website |
> | 💰 Nominal | Rp 2.500.000 |
> | 🧾 No. Invoice | INV-XXXXXX |
>
> 🔗 **Link Pembayaran:** https://sandbox.doku.com/...

**Apa yang terjadi:** Agent mengekstrak `nama_klien=PT Kreasi Digital`, `item_deskripsi=jasa pembuatan website`, `nominal_rupiah=2500000`, lalu memanggil tool `doku_create_payment_link`.

### Skenario 2 — Penagihan personal dengan format nominal "ribu"

> **User:** Buat invoice untuk Budi Santoso 750 ribu untuk konsultasi bisnis 1 jam
>
> **PayGent:** menghasilkan tagihan `Rp 750.000` atas nama `Budi Santoso` untuk `konsultasi bisnis 1 jam`.

**Apa yang ditunjukkan:** Konversi unit "ribu" ke `750000` dilakukan oleh LLM tanpa parsing rules manual.

### Skenario 3 — Bahasa kasual dengan singkatan

> **User:** Aku mau nagih klien baru, namanya Sarah, untuk desain logo, harganya 500k
>
> **PayGent:** menghasilkan tagihan `Rp 500.000` atas nama `Sarah` untuk `desain logo`.

**Apa yang ditunjukkan:** Agent mengenali singkatan `500k = 500000` dan tetap mengikuti workflow yang sama dengan skenario formal.

---

## Key Technical Differentiators

- **Native OpenClaw Plugin SDK.** Tool penagihan ditulis dalam TypeScript dengan `definePluginEntry` dari `openclaw/plugin-sdk/core`, schema parameter divalidasi via Typebox, return type strongly-typed (`AnyAgentTool` / `AgentToolResult`). Tidak ada `any`, tidak ada glue script. Lihat `plugins/doku-payment/index.ts`.

- **SKILL.md sebagai declarative workflow.** Logika "kapan menagih, apa yang ditanyakan kalau info kurang, format respons sukses, format respons error" hidup sebagai markdown dengan YAML front-matter (`skills/doku-billing/SKILL.md`) — bukan hardcoded prompt di kode. Edit perilaku agent berarti edit satu file markdown.

- **Real Doku Sandbox API call.** Plugin memanggil endpoint `/checkout/v1/payment` Doku Sandbox secara langsung, lengkap dengan invoice number, session ID, dan payment due time. Tidak ada mocking, tidak ada simulasi — link yang dihasilkan benar-benar bisa dibuka di browser.

- **WebChat embed langsung di Next.js.** Frontend punya custom chat UI (`src/components/ChatWindow.tsx`) yang POST ke `localhost:3001/api/message`. Bridge di `server/` adalah runtime ringan untuk SKILL.md + plugin tool yang sama yang didaftarkan ke OpenClaw Gateway via `definePluginEntry`.

- **Natural language entity extraction.** User tidak perlu mengisi form, memilih dropdown, atau mengikuti template. Tiga entitas wajib (`nama_klien`, `item_deskripsi`, `nominal_rupiah`) diekstrak dari satu kalimat oleh Groq LLaMA-3 70B; konversi unit ("juta", "ribu", "k") ditangani oleh LLM tanpa rule-based parser.

---

## Repository Layout

```
paygent-openclaw/
├── config/
│   └── openclaw.json              # OpenClaw Gateway configuration
├── plugins/
│   └── doku-payment/              # TypeScript plugin (Doku integration)
│       ├── index.ts               # definePluginEntry + executeDokuCreatePaymentLink
│       ├── package.json
│       ├── tsconfig.json
│       └── dist/                  # Built JS, loaded by gateway / imported by bridge
├── skills/
│   └── doku-billing/
│       └── SKILL.md               # Declarative billing workflow
├── server/                        # Thin HTTP bridge (Express + Groq tool calling)
│   ├── bridge.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── OC-3.1-test.md             # Live end-to-end test report
├── paygent-frontend/              # Next.js 16 + Tailwind CSS frontend
└── .env.example                   # Template untuk credentials
```

---

## Stack

- **Agent Framework:** OpenClaw 2026.5.7
- **LLM Provider:** Groq (LLaMA-3 70B 8192 ctx)
- **Payment Gateway:** Doku Sandbox (Checkout API v1)
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS 4
- **Plugin Build:** TypeScript 5 + tsdown (ESM)

---

## License

MIT
