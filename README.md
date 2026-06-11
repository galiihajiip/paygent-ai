<div align="center">

# PayGent - Auto-Biller AI

> **PIBITI 2026 Submission**  
> Tagih klien dalam satu kalimat. Terima payment link dalam hitungan detik.

[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel)](https://laravel.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-V3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-black)](https://groq.com)
[![Doku](https://img.shields.io/badge/Doku-Payment%20API-orange)](https://doku.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Built for **PIBITI Indonesia 2026**
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
4. Saves everything to a beautiful CFO Dashboard

![Demo Screenshot](public/icons/icon-512.png)
*(Note: Replace with actual GIF/Screenshot before final submission)*

## Architecture

```text
+---------------------------------------------------------+
|                    USER INTERFACE                       |
|   Laravel Blade - Tailwind V3 - Alpine.js - PWA Ready   |
+------------------------+--------------------------------+
                         |
                         | Natural language input
                         v
+---------------------------------------------------------+
|                  LARAVEL 13 BACKEND                     |
|                                                         |
|  +-------------------+      +------------------------+  |
|  | Agent Prompting   |      | Doku Payment Service   |  |
|  | System            +----->| Guzzle HTTP Client     |  |
|  |                   |      | HMAC signed request    |  |
|  +-------------------+      +------------+-----------+  |
|                                           |             |
|      Groq LLaMA-3.3 70B reasoning loop    |             |
|      Real-time SSE Streaming              |             |
+-------------------------------------------+-------------+
                                            |
                                            | HTTPS POST
                                            v
+---------------------------------------------------------+
|                    DOKU SANDBOX API                     |
|                 /checkout/v1/payment                    |
|                 returns payment link URL                |
+---------------------------------------------------------+
```

## Tech Stack

| Category | Technology | Why We Chose It |
|----------|------------|-----------------|
| Fullstack Framework | Laravel 13 | Extremely fast development, secure backend, and robust ecosystem |
| Frontend | Blade + Alpine.js | Interactive real-time streaming UI without heavy JS frameworks |
| Styling | Tailwind CSS V3 | Rapid iteration, beautiful glassmorphism, and instant dark mode |
| Database | SQLite | Zero-config, lightweight database perfect for hackathons |
| Reasoning | Groq LLaMA-3.3 70B | Blazing fast natural-language extraction and decision making |
| Payment | Doku Sandbox API | Real Indonesian payment gateway integration |
| PWA | Web Manifest + Service Worker | Installable on mobile/desktop as a native-feeling app |

## Installation

### Prerequisites

- PHP 8.3+
- Composer
- Node.js & NPM
- Groq account: https://console.groq.com
- Doku Sandbox account: https://jokul.doku.com

### Quick Start

**1. Clone repository**

```bash
git clone https://github.com/galiihajiip/paygent-ai.git
cd paygent-ai/paygent-laravel
```

**2. Configure environment**

```bash
cp .env.example .env
```
Open `.env` and configure your API keys:
```env
GROQ_API_KEY=your_api_key_here
DOKU_CLIENT_ID=your_client_id
DOKU_SECRET_KEY=your_secret_key
DOKU_BASE_URL=https://api-sandbox.doku.com
```

**3. Install dependencies**

```bash
composer install
npm install
```

**4. Setup Database & Key**

```bash
php artisan key:generate
php artisan migrate --seed
```

**5. Run the Application**

Start the Vite dev server for Tailwind compilation:
```bash
npm run dev
```

In a new terminal, start the Laravel server:
```bash
php artisan serve
```

**6. Test**

Open http://localhost:8000 and try typing:

> "Tagihkan PT Maju Bersama 1 juta untuk jasa konsultasi"

## License

MIT License - Built for PIBITI Indonesia 2026

**Developed by:** Galih Aji Pangestu
