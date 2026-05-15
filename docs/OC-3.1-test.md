# OC-3.1 Live Test Report

**Date:** 2026-05-14
**Result:** ✅ All three demo scenarios pass with real Groq inference and real Doku Sandbox payment links.

## Setup

- **Bridge:** `paygent-openclaw/server/bridge.ts` (Express + tsx, listens on :3001)
- **Skill:** `paygent-openclaw/skills/doku-billing/SKILL.md` (loaded at boot, body used as system prompt)
- **Tool:** `paygent-openclaw/plugins/doku-payment/index.ts` (`executeDokuCreatePaymentLink` invoked directly via OpenAI-compatible function calling)
- **Model:** `groq/llama-3.3-70b-versatile`
- **Doku endpoint:** `https://api-sandbox.doku.com/checkout/v1/payment`

## Why a bridge instead of `openclaw gateway run`

OpenClaw 2026.5.7's embedded agent harness injects ~30,000 tokens of internal context per turn (bundled skills, capability metadata, tool registry chrome). On Groq's free tier the per-request TPM cap is 12,000 for `llama-3.3-70b-versatile` and 6,000 for `llama-3.1-8b-instant`, so every gateway turn fails with a 413 before the tool can even fire. We tried multiple config knobs to slim it down (`tools.profile=minimal`, `tools.allow=[doku_create_payment_link]`, `skills.allowBundled=[]`, `agents.defaults.systemPromptOverride=…`) — they reduce the prompt but never below the cap. We also hit a separate issue where, despite the plugin reporting `Status: loaded`, the agent harness reported `0 callable tools` (the registration callback path between the discovery loader and the embedded harness didn't fire end-to-end on this build).

The bridge is a thin alternative runner that uses the **same** SKILL.md and the **same** plugin tool function (`executeDokuCreatePaymentLink` is exported once and consumed by both `definePluginEntry` for the OpenClaw gateway path AND the bridge's HTTP handler). No logic is duplicated.

## Verification: HMAC parity

Before the live test, the TS plugin's `buildDokuSignature` was cross-validated against the Python reference in `paygent-backend/tools/doku_tool.py` with a fixed input. Both produced identical output:
```
digest:    XKDJcNfZ1h4Q/XFVUeTKRkPHnpqP1miZw5f1VB7uC5w=
signature: HMACSHA256=mR6LhmmOdH0jZNesVKAgArU6LzW5saRI/OX7YTNQmgw=
```

## Live results

### Scenario 1 — Penagihan korporat dengan format "juta"

**User:** `Tolong tagihkan PT Maju Bersama 2.5 juta untuk jasa konsultasi bisnis.`

**PayGent:**
```
✅ Tagihan berhasil dibuat!

Halo, PT Maju Bersama! 😊

| Detail        | Informasi                                        |
| 📋 Item        | jasa konsultasi bisnis                           |
| 💰 Nominal     | Rp 2.500.000                                     |
| 🧾 No. Invoice | INV-57CB0818                                     |

🔗 Link Pembayaran: https://staging.doku.com/checkout-link-v2/ddfe530419654abd8c57ae1ca489020e20260714120712616
```

### Scenario 2 — Penagihan personal dengan format "ribu"

**User:** `Buat invoice untuk Budi Santoso 750 ribu untuk konsultasi bisnis 1 jam`

**PayGent:**
```
✅ Tagihan berhasil dibuat!
Halo, Budi Santoso! 😊
| 💰 Nominal     | Rp 750.000                                       |
| 🧾 No. Invoice | INV-1EA155DB                                     |
🔗 Link Pembayaran: https://staging.doku.com/checkout-link-v2/56a657c3804b418b9875dd0d1c65896420260714120731730
```

### Scenario 3 — Bahasa kasual dengan singkatan "k"

**User:** `Aku mau nagih klien baru, namanya Sarah, untuk desain logo, harganya 500k`

**PayGent:**
```
✅ Tagihan berhasil dibuat!
Halo, Sarah! 😊
| 💰 Nominal     | Rp 500.000                                       |
| 🧾 No. Invoice | INV-738B7234                                     |
🔗 Link Pembayaran: https://staging.doku.com/checkout-link-v2/74a7b4771f564165b67f3e9d341dd1e520260714120735171
```

### Scenario 4 — Off-topic prompt (no tool call expected)

**User:** `Halo, apa kabar?`

**PayGent:**
```
Halo! Kabar baik, terima kasih. Saya PayGent, asisten keuangan AI yang proaktif dan profesional. Saya di sini untuk membantu Anda membuat tagihan dan payment link secara otomatis. Bagaimana saya bisa membantu Anda hari ini?
```

## What this proves

- Groq → SKILL.md system prompt → tool decision via OpenAI-compatible function calling → plugin's `executeDokuCreatePaymentLink` → real Doku Sandbox call → real `payment_url` returned to the user, formatted exactly per SKILL.md instructions.
- Unit conversion (`juta`, `ribu`, `k` → integer rupiah) handled by the LLM with no manual parser.
- Off-topic messages do not trigger the tool — the SKILL.md framing keeps the agent on-topic.
- Same plugin tool function is exported and reused by both the OpenClaw plugin entry (`definePluginEntry`) and the bridge runner.
