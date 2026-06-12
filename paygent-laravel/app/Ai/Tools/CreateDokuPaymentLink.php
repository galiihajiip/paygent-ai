<?php

namespace App\Ai\Tools;

use App\Models\Invoice;
use App\Models\User;
use App\Services\DokuPaymentService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class CreateDokuPaymentLink implements Tool
{
    public function __construct(
        protected ?User $user = null,
    ) {}

    public function description(): Stringable|string
    {
        return 'Buat payment link Doku ketika user meminta menagih seseorang. Ekstrak nama_klien, item_deskripsi, nominal_rupiah, dan nomor_whatsapp klien.';
    }

    public function handle(Request $request): Stringable|string
    {
        $clientName = (string) $request->string('nama_klien');
        $itemDescription = (string) $request->string('item_deskripsi');
        $amount = (int) $request->integer('nominal_rupiah');
        $whatsappNumber = $this->normalizeWhatsappNumber((string) $request->string('nomor_whatsapp'));

        if (! $whatsappNumber) {
            return 'ERROR: Nomor WhatsApp klien belum valid. Minta nomor dengan format 081234567890 atau 6281234567890.';
        }

        $result = app(DokuPaymentService::class)->createPaymentLink($clientName, $itemDescription, $amount);

        if (! ($result['success'] ?? false)) {
            return 'ERROR: '.($result['error'] ?? 'Gagal membuat payment link.');
        }

        if ($this->user) {
            Invoice::query()->updateOrCreate(
                ['invoice_number' => $result['invoice_number']],
                [
                    'user_id' => $this->user->id,
                    'client_name' => $clientName,
                    'item_description' => $itemDescription,
                    'amount' => $amount,
                    'status' => 'PENDING',
                    'payment_url' => $result['payment_url'],
                ],
            );
        }

        $result['whatsapp_number'] = $whatsappNumber;
        $result['whatsapp_message'] = $this->buildWhatsappInvoiceMessage($result);

        return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'nama_klien' => $schema->string()->description('Nama klien')->required(),
            'item_deskripsi' => $schema->string()->description('Deskripsi item atau jasa')->required(),
            'nominal_rupiah' => $schema->integer()->description('Jumlah tagihan Rupiah murni')->required(),
            'nomor_whatsapp' => $schema->string()->description('Nomor WhatsApp klien valid, contoh 081234567890 atau 6281234567890')->required(),
        ];
    }

    protected function normalizeWhatsappNumber(string $number): ?string
    {
        $digits = preg_replace('/\D+/', '', $number);

        if (str_starts_with($digits, '0')) {
            $digits = '62'.substr($digits, 1);
        }

        return preg_match('/^628\d{8,11}$/', $digits) ? $digits : null;
    }

    protected function buildWhatsappInvoiceMessage(array $payment): string
    {
        $amount = 'Rp '.number_format((int) ($payment['nominal_rupiah'] ?? 0), 0, ',', '.');

        return "Halo {$payment['nama_klien']},\n\n"
            ."Berikut tagihan untuk {$payment['item_deskripsi']}.\n"
            ."Nominal: {$amount}\n"
            ."No. Invoice: {$payment['invoice_number']}\n\n"
            ."Silakan lakukan pembayaran melalui link berikut:\n"
            ."{$payment['payment_url']}\n\n"
            .'Terima kasih.';
    }
}
