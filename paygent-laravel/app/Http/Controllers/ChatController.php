<?php

namespace App\Http\Controllers;

use App\Ai\Agents\PayGentAgent;
use App\Models\Invoice;
use App\Services\DokuPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Ai\Models\Conversation;
use Laravel\Ai\Models\ConversationMessage;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::query()
            ->where('user_id', $request->user()->id)
            ->latest('updated_at')
            ->limit(20)
            ->get();

        $activeConversation = null;
        $messages = collect();

        if ($request->filled('conversation')) {
            $activeConversation = Conversation::query()
                ->where('user_id', $request->user()->id)
                ->where('id', $request->string('conversation'))
                ->firstOrFail();

            $messages = ConversationMessage::query()
                ->where('conversation_id', $activeConversation->id)
                ->orderBy('created_at')
                ->get();
        }

        return view('chat.index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'messages' => $messages,
        ]);
    }

    public function stream(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'conversation_id' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $billingContext = $this->billingContext($validated['message'], $validated['conversation_id'] ?? null, $user->id);
        $billingData = $this->extractBillingData($billingContext);

        if ($billingData) {
            return $this->paymentStream($user, $validated['message'], $validated['conversation_id'] ?? null, $billingData);
        }

        if ($this->needsWhatsappNumber($billingContext)) {
            return $this->assistantTextStream(
                $user,
                $validated['message'],
                $validated['conversation_id'] ?? null,
                'Boleh kirim nomor WhatsApp klien yang valid dulu? Formatnya bisa seperti 081234567890 atau 6281234567890. Nomor ini dipakai untuk tombol Tagih Sekarang.',
            );
        }

        if (! filled(config('ai.providers.groq.key'))) {
            return $this->demoStream($user, $validated['message'], $validated['conversation_id'] ?? null);
        }

        $agent = PayGentAgent::make(user: $user)->forUser($user);
        $conversation = null;

        if (! empty($validated['conversation_id'])) {
            $conversation = Conversation::query()
                ->where('user_id', $user->id)
                ->where('id', $validated['conversation_id'])
                ->firstOrFail();

            $agent->continue($conversation->id, $user);
        } else {
            $conversation = $this->resolveConversation($user->id, null, $validated['message']);
            $agent->continue($conversation->id, $user);
        }

        $stream = $agent->stream($validated['message']);

        return response()->stream(function () use ($stream, $conversation) {
            echo 'data: '.json_encode([
                'type' => 'conversation',
                'conversation_id' => $conversation->id,
                'title' => $conversation->title,
            ], JSON_UNESCAPED_UNICODE)."\n\n";
            ob_flush();
            flush();

            foreach ($stream as $event) {
                echo 'data: '.((string) $event)."\n\n";
                ob_flush();
                flush();
            }

            echo "data: [DONE]\n\n";
        }, headers: [
            'Cache-Control' => 'no-cache, no-transform',
            'Content-Type' => 'text/event-stream',
        ]);
    }

    protected function paymentStream($user, string $message, ?string $conversationId, array $billingData)
    {
        $conversation = $this->resolveConversation($user->id, $conversationId, $message);

        $result = app(DokuPaymentService::class)->createPaymentLink(
            $billingData['client_name'],
            $billingData['item_description'],
            $billingData['amount'],
        );

        if ($result['success'] ?? false) {
            $result['item_deskripsi'] = $billingData['item_description'];
            $result['nominal_rupiah'] = $billingData['amount'];
            $result['whatsapp_number'] = $billingData['whatsapp_number'];
            $result['whatsapp_message'] = $this->buildWhatsappInvoiceMessage($result);

            Invoice::query()->updateOrCreate(
                ['invoice_number' => $result['invoice_number']],
                [
                    'user_id' => $user->id,
                    'client_name' => $billingData['client_name'],
                    'item_description' => $billingData['item_description'],
                    'amount' => $billingData['amount'],
                    'status' => 'PENDING',
                    'payment_url' => $result['payment_url'],
                ],
            );

            $reply = json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $reply = 'Maaf, payment link Doku belum berhasil dibuat. '
                .($result['error'] ?? 'Terjadi error tidak dikenal.');
        }

        $this->storeMessage($conversation->id, $user->id, 'user', $message);
        $this->storeMessage($conversation->id, $user->id, 'assistant', $reply);

        return response()->stream(function () use ($conversation, $reply) {
            echo 'data: '.json_encode([
                'type' => 'conversation',
                'conversation_id' => $conversation->id,
                'title' => $conversation->title,
            ], JSON_UNESCAPED_UNICODE)."\n\n";
            ob_flush();
            flush();

            foreach (str_split($reply, 24) as $chunk) {
                echo 'data: '.json_encode([
                    'type' => 'text_delta',
                    'delta' => $chunk,
                ], JSON_UNESCAPED_UNICODE)."\n\n";
                ob_flush();
                flush();
                usleep(20000);
            }

            echo "data: [DONE]\n\n";
        }, headers: [
            'Cache-Control' => 'no-cache, no-transform',
            'Content-Type' => 'text/event-stream',
        ]);
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

    protected function assistantTextStream($user, string $message, ?string $conversationId, string $reply)
    {
        $conversation = $this->resolveConversation($user->id, $conversationId, $message);

        $this->storeMessage($conversation->id, $user->id, 'user', $message);
        $this->storeMessage($conversation->id, $user->id, 'assistant', $reply);

        return response()->stream(function () use ($conversation, $reply) {
            echo 'data: '.json_encode([
                'type' => 'conversation',
                'conversation_id' => $conversation->id,
                'title' => $conversation->title,
            ], JSON_UNESCAPED_UNICODE)."\n\n";
            ob_flush();
            flush();

            foreach (str_split($reply, 18) as $chunk) {
                echo 'data: '.json_encode([
                    'type' => 'text_delta',
                    'delta' => $chunk,
                ], JSON_UNESCAPED_UNICODE)."\n\n";
                ob_flush();
                flush();
                usleep(20000);
            }

            echo "data: [DONE]\n\n";
        }, headers: [
            'Cache-Control' => 'no-cache, no-transform',
            'Content-Type' => 'text/event-stream',
        ]);
    }

    protected function demoStream($user, string $message, ?string $conversationId)
    {
        $conversation = $this->resolveConversation($user->id, $conversationId, $message);
        $reply = $this->buildDemoReply($user->id, $message);

        $this->storeMessage($conversation->id, $user->id, 'user', $message);
        $this->storeMessage($conversation->id, $user->id, 'assistant', $reply);

        return response()->stream(function () use ($conversation, $reply) {
            echo 'data: '.json_encode([
                'type' => 'conversation',
                'conversation_id' => $conversation->id,
                'title' => $conversation->title,
            ], JSON_UNESCAPED_UNICODE)."\n\n";
            ob_flush();
            flush();

            foreach (str_split($reply, 18) as $chunk) {
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

    protected function resolveConversation(int $userId, ?string $conversationId, string $message): Conversation
    {
        if ($conversationId) {
            return Conversation::query()
                ->where('user_id', $userId)
                ->where('id', $conversationId)
                ->firstOrFail();
        }

        return Conversation::query()->create([
            'id' => (string) Str::uuid(),
            'user_id' => $userId,
            'title' => Str::limit($message, 80),
        ]);
    }

    protected function storeMessage(string $conversationId, int $userId, string $role, string $content): void
    {
        ConversationMessage::query()->create([
            'id' => (string) Str::uuid(),
            'conversation_id' => $conversationId,
            'user_id' => $userId,
            'agent' => PayGentAgent::class,
            'role' => $role,
            'content' => $content,
            'attachments' => [],
            'tool_calls' => [],
            'tool_results' => [],
            'usage' => [],
            'meta' => [],
        ]);

        Conversation::query()->where('id', $conversationId)->touch();
    }

    protected function buildDemoReply(int $userId, string $message): string
    {
        $amount = $this->parseAmount($message);
        $isBillingIntent = str_contains(Str::lower($message), 'tagih')
            || str_contains(Str::lower($message), 'invoice')
            || str_contains(Str::lower($message), 'tagihan');

        if (! $isBillingIntent) {
            return "Mode demo aktif karena GROQ_API_KEY belum diisi.\n\nSaya bisa membantu membuat invoice dari kalimat seperti: \"Tagihkan PT Kreasi Digital 2.5 juta untuk jasa pembuatan website\".";
        }

        if (! $amount) {
            return 'Siap, saya bisa bantu buatkan tagihan. Boleh saya tahu nama klien, deskripsi item, dan nominal tagihannya?';
        }

        $clientName = $this->parseClientName($message) ?: 'Klien Demo';
        $itemDescription = $this->parseItemDescription($message) ?: 'Jasa profesional';
        $invoiceNumber = 'INV-'.strtoupper(Str::random(8));

        Invoice::query()->create([
            'user_id' => $userId,
            'invoice_number' => $invoiceNumber,
            'client_name' => $clientName,
            'item_description' => $itemDescription,
            'amount' => $amount,
            'status' => 'PENDING',
            'payment_url' => null,
        ]);

        return "Tagihan berhasil dibuat dalam mode demo!\n\n"
            ."Halo, {$clientName}!\n\n"
            ."Berikut detail tagihannya:\n"
            ."Item: {$itemDescription}\n"
            .'Nominal: Rp '.number_format($amount, 0, ',', '.')."\n"
            ."No. Invoice: {$invoiceNumber}\n\n"
            ."Catatan: payment link Doku dan AI live akan aktif setelah GROQ_API_KEY serta kredensial Doku diisi di file .env.";
    }

    protected function parseAmount(string $message): ?int
    {
        $normalized = Str::lower(str_replace(',', '.', $message));

        if (preg_match('/(\d+(?:\.\d+)?)\s*(juta|jt)/', $normalized, $matches)) {
            return (int) (((float) $matches[1]) * 1_000_000);
        }

        if (preg_match('/(\d+(?:\.\d+)?)\s*(ribu|rb|k)/', $normalized, $matches)) {
            return (int) (((float) $matches[1]) * 1_000);
        }

        if (preg_match('/rp\s*([\d.]+)/', $normalized, $matches)) {
            return (int) str_replace('.', '', $matches[1]);
        }

        if (preg_match('/\b(\d{4,})\b/', $normalized, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    protected function extractBillingData(string $message): ?array
    {
        $normalized = Str::lower($message);
        $isBillingIntent = str_contains($normalized, 'tagih')
            || str_contains($normalized, 'invoice')
            || str_contains($normalized, 'tagihan')
            || str_contains($normalized, 'payment link');

        if (! $isBillingIntent) {
            return null;
        }

        $amount = $this->parseAmount($message);
        $clientName = $this->parseClientName($message);
        $itemDescription = $this->parseItemDescription($message);
        $whatsappNumber = $this->parseWhatsappNumber($message);

        if (! $amount || ! $clientName || ! $itemDescription || ! $whatsappNumber) {
            return null;
        }

        return [
            'client_name' => $clientName,
            'item_description' => $this->cleanItemDescription($itemDescription),
            'amount' => $amount,
            'whatsapp_number' => $whatsappNumber,
        ];
    }

    protected function needsWhatsappNumber(string $message): bool
    {
        $normalized = Str::lower($message);
        $isBillingIntent = str_contains($normalized, 'tagih')
            || str_contains($normalized, 'invoice')
            || str_contains($normalized, 'tagihan')
            || str_contains($normalized, 'payment link');

        return $isBillingIntent
            && $this->parseAmount($message)
            && $this->parseClientName($message)
            && $this->parseItemDescription($message)
            && ! $this->parseWhatsappNumber($message);
    }

    protected function billingContext(string $message, ?string $conversationId, int $userId): string
    {
        if (! $conversationId) {
            return $message;
        }

        $previousMessages = ConversationMessage::query()
            ->where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->where('role', 'user')
            ->latest('created_at')
            ->limit(4)
            ->pluck('content')
            ->reverse()
            ->push($message);

        return $previousMessages->implode("\n");
    }

    protected function parseClientName(string $message): ?string
    {
        if (preg_match('/tagih(?:kan)?\s+(.+?)\s+(?:rp\s*)?\d/i', $message, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    protected function parseItemDescription(string $message): ?string
    {
        if (preg_match('/\buntuk\s+(.+?)(?:\s+(?:ke\s+)?(?:no\.?|nomor|wa|whatsapp|nomor\s*(?:wa|whatsapp)|hp)\b|$)/i', $message, $matches)) {
            return $this->cleanItemDescription($matches[1]);
        }

        return null;
    }

    protected function cleanItemDescription(string $description): string
    {
        $description = preg_replace('/^[\s\/:;,-]*(?:deskripsi|item|jasa|pesan\s*invoice)\s*[:\-]?\s*/i', '', $description);
        $description = preg_replace('/\s+(?:ke\s+)?(?:no\.?|nomor|wa|whatsapp|nomor\s*(?:wa|whatsapp)|hp)\b.*$/i', '', $description);

        return trim($description);
    }

    protected function parseWhatsappNumber(string $message): ?string
    {
        if (! preg_match_all('/(?:\+?62|0)[\d\s().-]{7,18}\d/', $message, $matches)) {
            return null;
        }

        foreach ($matches[0] as $match) {
            $number = preg_replace('/\D+/', '', $match);

            if (str_starts_with($number, '0')) {
                $number = '62'.substr($number, 1);
            }

            if (preg_match('/^628\d{8,11}$/', $number)) {
                return $number;
            }
        }

        return null;
    }
}
