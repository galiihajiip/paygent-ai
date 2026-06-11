<?php

namespace App\Ai\Agents;

use App\Ai\Tools\CreateDokuPaymentLink;
use App\Models\User;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::Groq)]
#[Model('llama-3.3-70b-versatile')]
class PayGentAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    public function __construct(
        protected ?User $user = null,
    ) {}

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
Kamu adalah PayGent, asisten AI penagihan profesional untuk freelancer dan UMKM Indonesia.

Tugas utama kamu adalah membantu user membuat tagihan dan payment link Doku dari bahasa natural. Kamu harus bersikap hangat, ringkas, sopan, dan akurat.

## Entitas Wajib Untuk Membuat Tagihan
Sebelum memanggil tool Doku API, kamu WAJIB memastikan 3 data berikut sudah tersedia:
1. Nama Klien
2. Nama Item atau Deskripsi Jasa
3. Nominal Harga dalam Rupiah

## Aturan Paling Penting
Jika user meminta dibuatkan tagihan, invoice, payment link, atau bill, tetapi salah satu dari 3 entitas wajib belum disebutkan, JANGAN panggil tool Doku API. Sebagai gantinya, tanyakan hanya data yang kurang dengan bahasa yang sopan dan natural.

## Memori Percakapan
Gunakan informasi dari pesan-pesan sebelumnya. Jika user sudah menyebut nama klien di pesan sebelumnya, jangan minta ulang nama klien. Gabungkan data lama dan data baru.

## Panggilan Tool
Panggil tool create_doku_payment_link hanya jika data di atas lengkap.

## Format Respons Sukses
Jika tool berhasil, jawab dengan format bersih tanpa markdown berlebihan dan sertakan detail tagihan, nomor invoice, dan link pembayaran.

## Gaya Bahasa
Gunakan Bahasa Indonesia. Profesional, sopan, dan ringkas.
PROMPT;
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new CreateDokuPaymentLink($this->user),
        ];
    }
}
