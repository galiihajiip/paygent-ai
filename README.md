<div align="center">

# 🤖 PayGent — Auto-Biller AI

**Tagih klien dalam satu kalimat. Terima payment link dalam detik.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Agent-blue)](https://openclaw.ai)
[![Doku](https://img.shields.io/badge/Doku-Payment%20API-orange)](https://doku.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Dibangun dalam 12 jam untuk **OpenClaw Agenthon Indonesia 2026**
> 🏆 Submission untuk kategori **Best Payment Use Case** · Powered by Doku

[▶ Lihat Demo](#demo) · [🚀 Deploy Sendiri](#installation) · [📐 Arsitektur](#architecture)

</div>

## The Problem

Indonesian freelancers lose an average of 3-5 hours every week creating invoices manually, copying client details, formatting totals, and sending follow-up payment messages by hand.

The bigger issue is "pekewuh culture": the social hesitation to chase overdue clients. Existing invoice tools like spreadsheets and Canva templates look nice, but they are not connected to payment gateways, so cash flow still gets stuck.

## Demo

### Cukup ketik satu kalimat:

> *"Tagihkan PT Kreasi Digital 2.5 juta untuk jasa pembuatan website"*

**PayGent langsung:**
1. 🧠 Memahami intent & mengekstrak entitas (klien, item, nominal)
2. 🔧 Memanggil Doku Payment API secara real-time
3. 💳 Mengembalikan payment link yang siap dikirim ke klien
4. 📄 Menampilkan Invoice Card yang bisa diunduh sebagai PNG

![Demo GIF](docs/demo.gif)
> *Rekam demo dan letakkan di `docs/demo.gif` sebelum submission*

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│         Next.js 16 · Tailwind CSS · Dark Mode · PWA     │
└────────────────────────┬────────────────────────────────┘
                         │ Natural Language Input
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  OPENCLAW GATEWAY                        │
│              Self-hosted AI Agent Core                   │
│                                                          │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │  SKILL.md       │    │  Plugin: doku-payment     │    │
│  │  doku-billing   │───▶│  TypeScript · Fetch API   │    │
│  │  (Workflow)     │    │  (Tool Execution)         │    │
│  └─────────────────┘    └──────────────┬───────────┘    │
│                                        │                 │
│         Model: Groq LLaMA-3 70B        │                 │
│         (ReAct Reasoning Loop)         │                 │
└────────────────────────────────────────┼────────────────┘
                                         │ HTTPS POST
                                         ▼
┌─────────────────────────────────────────────────────────┐
│              DOKU SANDBOX API                            │
│         /checkout/v1/payment                             │
│         Returns: Payment Link URL                        │
└─────────────────────────────────────────────────────────┘
```

**Layer breakdown:**

| Layer | Technology | Function |
|-------|------------|----------|
| UI | Next.js + Tailwind | Chat interface, Invoice Card, PWA |
| Agent Core | OpenClaw Gateway | Orchestration, ReAct reasoning |
| Workflow | SKILL.md | Declarative billing workflow |
| Tool | TypeScript Plugin | Doku API caller |
| LLM | Groq LLaMA-3 70B | Natural language understanding |
| Payment | Doku Sandbox | Payment link generation |

## Tech Stack

| Category | Technology | Why We Chose It |
|----------|------------|-----------------|
| Frontend | Next.js 16 App Router | Server Components + streaming-ready architecture for an instant chat feel |
| Styling | Tailwind CSS + Dark Mode | Zero runtime CSS, dark mode via class strategy |
| Agent | OpenClaw Gateway | Self-hosted, extensible via SKILL.md and TypeScript plugins |
| LLM | Groq LLaMA-3 70B | Sub-1s inference, free tier enough for hackathon load |
| Payment | Doku Sandbox API | Indonesian payment gateway, supports VA, QRIS, e-wallet |
| PWA | Next.js native manifest | Installable on mobile/desktop without extra libraries |

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- OpenClaw CLI (`npm install -g openclaw`)
- Groq account (free): https://console.groq.com
- Doku Sandbox account: https://jokul.doku.com

### Quick Start

**1. Clone repository**

```bash
git clone https://github.com/galiihajiip/paygent-autobiller.git
cd paygent-autobiller
```

**2. Setup Backend (OpenClaw artifacts + bridge runner)**

```bash
# Copy and fill environment variables
cp .env.example .env
# Edit .env: fill GROQ_API_KEY, DOKU_CLIENT_ID, DOKU_SECRET_KEY

# Build the Doku payment plugin
cd plugins/doku-payment
npm install
npm run build
cd ../..

# Install and run the OpenClaw bridge
cd server
npm install
npm start
# Bridge runs at http://localhost:3001
```

> The bridge loads the same OpenClaw artifacts used by the gateway path: `skills/doku-billing/SKILL.md` for the workflow and `plugins/doku-payment` for the executable Doku tool. It keeps the demo lightweight and reliable for hackathon environments.

**3. Setup Frontend (Next.js)**

```bash
cd paygent-frontend
cp .env.local.example .env.local
npm install
npm run dev
# App runs at http://localhost:3000
```

**4. Test**

Open http://localhost:3000 and type:

> "Tagihkan PT Maju Bersama 1 juta untuk jasa konsultasi"

## Environment Variables

| Variable | Where to Get | Required |
|----------|--------------|----------|
| `GROQ_API_KEY` | https://console.groq.com | Required |
| `DOKU_CLIENT_ID` | https://jokul.doku.com | Required |
| `DOKU_SECRET_KEY` | https://jokul.doku.com | Required |
| `DOKU_BASE_URL` | Default `https://api-sandbox.doku.com` | Optional |
| `NEXT_PUBLIC_API_URL` | Default `http://localhost:8000` | Optional |
| `NEXT_PUBLIC_OPENCLAW_URL` | Default `http://localhost:3001` | Optional |

## License

MIT License · Built with ❤️ for OpenClaw Agenthon Indonesia 2026

**Team:** PayGent

**Special Thanks:** Doku · OpenClaw · Groq · Build Club Indonesia
