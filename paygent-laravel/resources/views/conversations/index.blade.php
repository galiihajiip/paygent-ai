<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-slate-800 dark:text-slate-100">Riwayat Chat</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
            @forelse ($conversations as $conversation)
                <div class="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div>
                        <h3 class="font-semibold text-slate-900 dark:text-white">{{ $conversation->title }}</h3>
                        <p class="text-sm text-slate-500">{{ $conversation->messages_count }} pesan · {{ $conversation->updated_at->diffForHumans() }}</p>
                    </div>
                    <div class="flex gap-2">
                        <a href="{{ route('conversations.show', $conversation) }}" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Buka</a>
                        <a href="{{ route('chat.index', ['conversation' => $conversation->id]) }}" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Lanjut Chat</a>
                    </div>
                </div>
            @empty
                <p class="text-slate-500">Belum ada riwayat chat.</p>
            @endforelse
            {{ $conversations->links() }}
        </div>
    </div>
</x-app-layout>
