<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class DokuPaymentService
{
    public function buildSignature(
        string $clientId,
        string $secretKey,
        string $requestId,
        string $requestTimestamp,
        string $requestTarget,
        string $bodyStr,
    ): string {
        $digest = base64_encode(hash('sha256', $bodyStr, true));

        $component = "Client-Id:{$clientId}\n"
            ."Request-Id:{$requestId}\n"
            ."Request-Timestamp:{$requestTimestamp}\n"
            ."Request-Target:{$requestTarget}\n"
            ."Digest:{$digest}";

        $signature = base64_encode(hash_hmac('sha256', $component, $secretKey, true));

        return "HMACSHA256={$signature}";
    }

    /**
     * @return array{success: bool, payment_url?: string, invoice_number?: string, nama_klien?: string, item_deskripsi?: string, nominal_rupiah?: int, error?: string}
     */
    public function createPaymentLink(string $clientName, string $itemDescription, int $amount): array
    {
        $clientId = config('services.doku.client_id', env('DOKU_CLIENT_ID'));
        $secretKey = config('services.doku.secret_key', env('DOKU_SECRET_KEY'));
        $baseUrl = config('services.doku.base_url', env('DOKU_BASE_URL', 'https://api-sandbox.doku.com'));

        if (! $clientId || ! $secretKey) {
            return [
                'success' => false,
                'error' => 'DOKU_CLIENT_ID atau DOKU_SECRET_KEY belum dikonfigurasi.',
            ];
        }

        $invoiceNumber = 'INV-'.strtoupper(Str::random(8));
        $requestId = (string) Str::uuid();
        $requestTimestamp = gmdate('Y-m-d\TH:i:s\Z');
        $requestTarget = '/checkout/v1/payment';

        $body = [
            'order' => [
                'amount' => $amount,
                'invoice_number' => $invoiceNumber,
                'currency' => 'IDR',
                'line_items' => [
                    [
                        'id' => 'ITEM-001',
                        'name' => $itemDescription,
                        'price' => $amount,
                        'quantity' => 1,
                    ],
                ],
            ],
            'payment' => ['payment_due_date' => 60],
            'customer' => [
                'id' => 'PAYGENT-CUST-001',
                'name' => $clientName,
                'email' => 'billing@paygent.ai',
            ],
        ];

        $bodyStr = json_encode($body, JSON_UNESCAPED_SLASHES);
        $signature = $this->buildSignature($clientId, $secretKey, $requestId, $requestTimestamp, $requestTarget, $bodyStr);

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Client-Id' => $clientId,
                    'Request-Id' => $requestId,
                    'Request-Timestamp' => $requestTimestamp,
                    'Signature' => $signature,
                    'Content-Type' => 'application/json',
                ])
                ->withBody($bodyStr, 'application/json')
                ->post("{$baseUrl}{$requestTarget}");

            if (! $response->successful()) {
                return [
                    'success' => false,
                    'error' => "Doku API status {$response->status()}: ".$response->body(),
                ];
            }

            $paymentUrl = data_get($response->json(), 'response.payment.url');

            if (! $paymentUrl) {
                return [
                    'success' => false,
                    'error' => 'Struktur response Doku tidak dikenal.',
                ];
            }

            return [
                'success' => true,
                'payment_url' => $paymentUrl,
                'invoice_number' => $invoiceNumber,
                'nama_klien' => $clientName,
                'item_deskripsi' => $itemDescription,
                'nominal_rupiah' => $amount,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
