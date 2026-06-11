<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SummaryAgent;
use App\Models\Invoice;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    public function stream(Request $request)
    {
        $user = $request->user();

        $invoices = Invoice::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(20)
            ->get();

        $context = $invoices->map(fn (Invoice $invoice) => sprintf(
            '- %s | %s | %s | %s | %s',
            $invoice->invoice_number,
            $invoice->client_name,
            $invoice->formattedAmount(),
            $invoice->status,
            $invoice->item_description,
        ))->join("\n");

        $prompt = "Ringkas data invoice berikut untuk user:\n\n".$context;

        if ($invoices->isEmpty()) {
            $prompt = 'User belum punya invoice. Berikan saran singkat cara mulai membuat tagihan pertama dengan PayGent.';
        }

        if (! filled(config('ai.providers.groq.key'))) {
            $summary = $this->demoSummary($invoices);

            return response()->stream(function () use ($summary) {
                foreach (str_split($summary, 18) as $chunk) {
                    echo 'data: '.json_encode([
                        'type' => 'text_delta',
                        'delta' => $chunk,
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();
                    usleep(25000);
                }

                echo "data: [DONE]\n\n";
            }, headers: [
                'Cache-Control' => 'no-cache, no-transform',
                'Content-Type' => 'text/event-stream',
            ]);
        }

        return SummaryAgent::make()->stream($prompt);
    }

    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        return response()->json([
            'total' => Invoice::query()->where('user_id', $userId)->count(),
            'paid' => Invoice::query()->where('user_id', $userId)->where('status', 'PAID')->count(),
            'pending' => Invoice::query()->where('user_id', $userId)->where('status', 'PENDING')->count(),
            'revenue' => (int) Invoice::query()->where('user_id', $userId)->where('status', 'PAID')->sum('amount'),
            'outstanding' => (int) Invoice::query()->where('user_id', $userId)->where('status', 'PENDING')->sum('amount'),
            'updated_at' => now()->toIso8601String(),
        ]);
    }

    protected function demoSummary($invoices): string
    {
        if ($invoices->isEmpty()) {
            return "- Belum ada invoice.\n- Mulai dari menu Chat AI dengan format: \"Tagihkan Budi 500 ribu untuk desain logo\".\n- Mode demo aktif karena GROQ_API_KEY belum diisi.";
        }

        $total = $invoices->count();
        $paid = $invoices->where('status', 'PAID')->count();
        $pending = $invoices->where('status', 'PENDING')->count();
        $outstanding = $invoices->where('status', 'PENDING')->sum('amount');

        return "- Total invoice terbaru: {$total}.\n"
            ."- Paid: {$paid}, Pending: {$pending}.\n"
            .'- Outstanding: Rp '.number_format($outstanding, 0, ',', '.').".\n"
            ."- Rekomendasi: follow up invoice pending dan isi GROQ_API_KEY untuk mengaktifkan Summary AI live.";
    }
}
