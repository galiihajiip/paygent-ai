<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class DokuWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        $payload = $request->all();
        $invoiceNumber = data_get($payload, 'order.invoice_number')
            ?? data_get($payload, 'invoice_number');

        if (! $invoiceNumber) {
            return response()->json(['message' => 'invoice_number missing'], 422);
        }

        $status = strtoupper((string) (
            data_get($payload, 'transaction.status')
            ?? data_get($payload, 'status')
            ?? 'UNKNOWN'
        ));

        $mapped = match (true) {
            str_contains($status, 'SUCCESS'), str_contains($status, 'PAID') => 'PAID',
            str_contains($status, 'EXPIRE') => 'EXPIRED',
            str_contains($status, 'FAIL') => 'FAILED',
            default => 'PENDING',
        };

        $invoice = Invoice::query()->where('invoice_number', $invoiceNumber)->first();

        if ($invoice) {
            $invoice->update([
                'status' => $mapped,
                'paid_at' => $mapped === 'PAID' ? now() : $invoice->paid_at,
                'raw_notification' => $payload,
            ]);
        }

        return response()->json(['message' => 'ok']);
    }
}
