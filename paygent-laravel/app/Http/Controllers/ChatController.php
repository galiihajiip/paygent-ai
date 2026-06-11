<?php

namespace App\Http\Controllers;

use App\Ai\Agents\PayGentAgent;
use App\Models\Invoice;
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

        if (! filled(config('ai.providers.groq.key'))) {
            return $this->demoStream($user, $validated['message'], $validated['conversation_id'] ?? null);
        }

        $agent = PayGentAgent::make(user: $user)->forUser($user);

        if (! empty($validated['conversation_id'])) {
            Conversation::query()
                ->where('user_id', $user->id)
                ->where('id', $validated['conversation_id'])
                ->firstOrFail();

            $agent->continue($validated['conversation_id'], $user);
        }

        return $agent->stream($validated['message']);
    }

    protected function demoStream($user, string $message, ?string $conversationId)
    {
        $conversation = $this->resolveConversation($user->id, $conversationId, $message);
        $reply = $this->buildDemoReply($user->id, $message);

        $this->storeMessage($conversation->id, $user->id, 'user', $message);
        $this->storeMessage($conversation->id, $user->id, 'assistant', $reply);

        return response()->stream(function () use ($reply) {
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

    protected function parseClientName(string $message): ?string
    {
        if (preg_match('/tagih(?:kan)?\s+(.+?)\s+(?:rp\s*)?\d/i', $message, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    protected function parseItemDescription(string $message): ?string
    {
        if (preg_match('/\buntuk\s+(.+)$/i', $message, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }
}
