# PayGent Laravel — PIBITI 2026 Final Project

Submission Laravel 13 untuk bootcamp PIBITI 2026. PayGent membantu freelancer/UMKM membuat tagihan dan payment link Doku dari bahasa natural.

## Stack

- Laravel 13
- Laravel Breeze (Blade + Auth)
- Tailwind CSS + Vite
- Laravel AI SDK (`laravel/ai`) + Groq
- SQLite (default) / MySQL

## PIBITI Checklist

| Requirement | Status | Implementasi |
|-------------|--------|--------------|
| Laravel 13 setup | ✅ | `paygent-laravel/` |
| Blade responsive UI | ✅ | `resources/views/chat`, `dashboard`, `invoices` |
| Dark mode + persistence | ✅ | `localStorage` key `paygent-theme`, toggle di semua halaman |
| Laravel AI SDK | ✅ | `app/Ai/Agents/PayGentAgent.php` |
| Routing & Controllers | ✅ | `routes/web.php`, controllers di `app/Http/Controllers` |
| Database chat history | ✅ | `agent_conversations`, `agent_conversation_messages` |
| AI streaming response | ✅ | `POST /chat/stream` (SSE) |
| Summary AI realtime | ✅ | `GET /summary/stream` + polling stats dashboard |
| Authentication | ✅ | Laravel Breeze |
| Database CRUD | ✅ | Invoice CRUD |
| Fitur AI bermanfaat | ✅ | NL → invoice → Doku payment link |
| Responsive design | ✅ | Tailwind breakpoints |
| Kreativitas | ✅ | CFO dashboard, voice-ready chat UX, Doku webhook |

## Setup

```bash
cd paygent-laravel
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
npm run build
php artisan serve
```

Buka `http://127.0.0.1:8000`, daftar akun, lalu masuk ke **Chat AI**.

## Environment

```env
GROQ_API_KEY=your_groq_key
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_BASE_URL=https://api-sandbox.doku.com
```

Tanpa kredensial Doku, AI tetap berjalan tetapi tool payment link akan mengembalikan error konfigurasi.

## Fitur Utama

- **Chat AI PayGent**: streaming SSE, history tersimpan per user
- **Invoice CRUD**: kelola tagihan manual
- **Dashboard CFO**: statistik + Summary AI streaming
- **Doku Webhook**: `POST /webhooks/doku` memperbarui status invoice
- **Dark Mode**: toggle di navbar, persist di seluruh halaman

## Struktur Penting

```
app/Ai/Agents/PayGentAgent.php      # Agent utama
app/Ai/Agents/SummaryAgent.php    # Ringkasan dashboard
app/Ai/Tools/CreateDokuPaymentLink.php
app/Services/DokuPaymentService.php
app/Http/Controllers/ChatController.php
resources/views/chat/index.blade.php
```

## Demo Script

1. Register / Login
2. Buka Chat AI → ketik: `Tagihkan Budi Santoso 500 ribu untuk desain logo`
3. Lihat respons AI streaming + payment link (jika Doku dikonfigurasi)
4. Buka Dashboard → Summary AI muncul realtime
5. Toggle dark mode → refresh halaman (tema tetap)
6. Kelola invoice di menu Invoices (CRUD)
