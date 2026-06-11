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
        return 'Buat payment link Doku ketika user meminta menagih seseorang. Ekstrak nama_klien, item_deskripsi, dan nominal_rupiah.';
    }

    public function handle(Request $request): Stringable|string
    {
        $clientName = (string) $request->string('nama_klien');
        $itemDescription = (string) $request->string('item_deskripsi');
        $amount = (int) $request->integer('nominal_rupiah');

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

        return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'nama_klien' => $schema->string()->description('Nama klien')->required(),
            'item_deskripsi' => $schema->string()->description('Deskripsi item atau jasa')->required(),
            'nominal_rupiah' => $schema->integer()->description('Jumlah tagihan Rupiah murni')->required(),
        ];
    }
}
