<div align="center">

# PayGent - Auto-Biller AI

**Tagih klien dalam satu kalimat. Terima payment link dalam detik.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Agent-blue)](https://openclaw.ai)
[![Doku](https://img.shields.io/badge/Doku-Payment%20API-orange)](https://doku.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Built in 12 hours for **OpenClaw Agenthon Indonesia 2026**
> Submission for **Best Payment Use Case** - Powered by Doku

[View Demo](#demo) | [Run Locally](#installation) | [Architecture](#architecture)

</div>

## The Problem

Indonesian freelancers lose an average of 3-5 hours every week creating invoices manually, copying client details, formatting totals, and sending follow-up payment messages by hand.

The bigger issue is "pekewuh culture": the social hesitation to chase overdue clients. Existing invoice tools like spreadsheets and Canva templates look nice, but they are not connected to payment gateways, so cash flow still gets stuck.

## Demo

### Just type one sentence:

> "Tagihkan PT Kreasi Digital 2.5 juta untuk jasa pembuatan website"

**PayGent instantly:**
1. Understands intent and extracts entities: client, item, amount
2. Calls the Doku Payment API in real time
3. Returns a payment link that is ready to send
4. Renders an Invoice Card that can be downloaded as PNG

![Demo GIF](docs/demo.gif)
> Record the demo and place it at `docs/demo.gif` before final submission.

## Architecture

```text
+---------------------------------------------------------+
|                    USER INTERFACE                       |
|        Next.js 16 - Tailwind CSS - Dark Mode - PWA      |
+------------------------+--------------------------------+
                         |
                         | Natural language input
                         v
+---------------------------------------------------------+
|                 PAYGENT AGENT RUNTIME                   |
|                                                         |
|  +-------------------+      +------------------------+  |
|  | SKILL.md          |      | Doku Payment Plugin    |  |
|  | doku-billing      +----->| TypeScript Fetch API   |  |
|  | workflow rules    |      | HMAC signed request    |  |
|  +-------------------+      +------------+-----------+  |
|                                           |              |
|      Groq LLaMA-3 70B reasoning loop      |              |
|      OpenClaw-style tool orchestration    |              |
+-------------------------------------------+-------------+
                                            |
                                            | HTTPS POST
                                            v
+---------------------------------------------------------+
|                    DOKU SANDBOX API                     |
|                 /checkout/v1/payment                    |
|                 returns payment link URL                 |
+---------------------------------------------------------+
```

**Layer breakdown:**

| Layer | Technology | Function |
|-------|------------|----------|
| UI | Next.js + Tailwind | Chat interface, Invoice Card, PWA install prompt |
| Agent Workflow | SKILL.md | Declarative billing rules and edge-case handling |
| Runtime Bridge | Express + OpenAI-compatible API | Lightweight runner for the OpenClaw-style agent flow |
| Legacy Reasoning Path | Python FastAPI + LangChain | Original reasoning engine and reference implementation |
| Tool | TypeScript Plugin | Doku API caller with HMAC signature |
| LLM | Groq LLaMA-3 70B | Natural language understanding |
| Payment | Doku Sandbox | Payment link generation |

## How We Built This (Hybrid Architecture)

PayGent uses a hybrid architecture designed for both hackathon reliability and agent extensibility.

The frontend is built with **Next.js 16**, Tailwind CSS, dark mode, PWA metadata, and an install prompt. This layer focuses on the user experience: a polished chat interface, natural-language billing flow, downloadable invoice cards, copyable payment links, and mobile-friendly interactions.

The reasoning layer started as a **Python FastAPI + LangChain** agent, where the AI reads the user's Indonesian billing request, extracts the required entities, and decides whether it has enough information to create an invoice. This Python path remains in the repository as the original reasoning engine and reference implementation.

For the final Agenthon demo, the same behavior is wrapped in an **OpenClaw-style agent ecosystem**:

- `skills/doku-billing/SKILL.md` acts as the declarative workflow: when to create invoices, when to ask for clarification, how to avoid hallucinating missing billing data, and how to answer payment-status questions.
- `plugins/doku-payment/` is the TypeScript tool/plugin that calls the real Doku Checkout API.
- `server/bridge.ts` is a lightweight self-hosted runner that loads the SKILL.md workflow, exposes an OpenAI-compatible tool-calling loop, and executes the Doku payment plugin.

This gives PayGent the best of both worlds: a premium Next.js product experience, a Python/LangChain reasoning foundation, and an OpenClaw-compatible skill/tool structure that makes the agent behavior inspectable, extensible, and judge-friendly.

## Tech Stack

| Category | Technology | Why We Chose It |
|----------|------------|-----------------|
| Frontend | Next.js 16 App Router | Fast, production-ready UI with PWA support |
| Styling | Tailwind CSS + Dark Mode | Rapid iteration and consistent design system |
| Agent Workflow | OpenClaw-style SKILL.md | Declarative agent behavior that judges can inspect |
| Reasoning | Python FastAPI + LangChain, Groq LLaMA-3 70B | Natural-language extraction and tool-use reasoning |
| Bridge Runtime | Express + TypeScript | Lightweight demo runner for SKILL.md + Doku plugin |
| Payment | Doku Sandbox API | Real Indonesian payment gateway integration |
| PWA | Next.js manifest + service worker | Installable on mobile/desktop without extra libraries |

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- OpenClaw CLI (`npm install -g openclaw`)
- Groq account: https://console.groq.com
- Doku Sandbox account: https://jokul.doku.com

### Quick Start

**1. Clone repository**

```bash
git clone https://github.com/galiihajiip/paygent-autobiller.git
cd paygent-autobiller
```

**2. Configure credentials**

```bash
cp .env.example .env
# Edit .env and fill:
# GROQ_API_KEY
# DOKU_CLIENT_ID
# DOKU_SECRET_KEY
```

**3. Build the Doku payment plugin**

```bash
cd plugins/doku-payment
npm install
npm run build
cd ../..
```

**4. Run the PayGent bridge**

```bash
cd server
npm install
npm start
# Bridge runs at http://localhost:3001
```

**5. Run the Next.js frontend**

```bash
cd paygent-frontend
cp .env.local.example .env.local
npm install
npm run dev
# App runs at http://localhost:3000
```

**6. Test**

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

## Future Roadmap

### 1. Doku Webhook Listener

The next milestone is a production-grade **Doku Webhook Listener**. Instead of only generating payment links, PayGent will listen for Doku payment notifications and update invoice status automatically.

Future flow:

```text
Customer pays invoice
        |
        v
Doku sends webhook notification
        |
        v
PayGent marks invoice as PAID
        |
        v
PayGent sends an automatic message:
"Invoice INV-XXXX has been paid. Payment received from PT Kreasi Digital."
```

This turns PayGent from a payment-link generator into a full billing assistant: it can create invoices, monitor payment status, and notify the freelancer the moment money arrives.

### 2. WhatsApp Payment Follow-up

PayGent will be able to send payment links and paid/unpaid reminders directly to WhatsApp, matching how Indonesian freelancers already communicate with clients.

### 3. Client & Revenue Dashboard

Future versions will store client profiles, invoice history, payment status, monthly revenue, and late-payment analytics.

## License

MIT License - Built for OpenClaw Agenthon Indonesia 2026

**Developed by:** Galih Aji Pangestu

**Special Thanks:** Doku · OpenClaw · Groq · Build Club Indonesia
