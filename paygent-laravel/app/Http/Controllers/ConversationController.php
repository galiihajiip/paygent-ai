<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Ai\Models\Conversation;
use Laravel\Ai\Models\ConversationMessage;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::query()
            ->where('user_id', $request->user()->id)
            ->withCount('messages')
            ->latest('updated_at')
            ->paginate(15);

        return view('conversations.index', compact('conversations'));
    }

    public function show(Request $request, string $conversation)
    {
        $conversation = Conversation::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $conversation)
            ->firstOrFail();

        $messages = ConversationMessage::query()
            ->where('conversation_id', $conversation->id)
            ->orderBy('created_at')
            ->get();

        return view('conversations.show', compact('conversation', 'messages'));
    }

    public function destroy(Request $request, string $conversation)
    {
        $conversation = Conversation::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $conversation)
            ->firstOrFail();

        ConversationMessage::query()
            ->where('conversation_id', $conversation->id)
            ->delete();

        $conversation->delete();

        return redirect()->route('conversations.index')->with('status', 'Percakapan dihapus.');
    }
}
