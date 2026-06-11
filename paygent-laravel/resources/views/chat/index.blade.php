<x-app-layout>
    <div class="flex flex-col h-[calc(100vh-3.5rem)] bg-[#F8FAFC] dark:bg-[#0B1120]">
        <!-- Mobile Header (Hidden on Desktop) -->
        <div class="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PG</div>
                <span class="font-bold text-slate-900 dark:text-white">Chat AI</span>
            </div>
            <a href="{{ route('chat.index') }}" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
        </div>

        <div class="flex flex-1 overflow-hidden relative">
            <!-- Sidebar History -->
            <aside class="hidden md:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shrink-0">
                <div class="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <span class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Riwayat Tagihan</span>
                    <a href="{{ route('chat.index') }}" class="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors" title="Percakapan Baru">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </a>
                </div>
                <div class="flex-1 overflow-y-auto p-3 space-y-1">
                    @forelse ($conversations as $conversation)
                        <a href="{{ route('chat.index', ['conversation' => $conversation->id]) }}"
                           class="block rounded-xl px-3 py-2.5 text-sm transition-all {{ optional($activeConversation)->id === $conversation->id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' }}">
                            <div class="font-semibold truncate">{{ $conversation->title }}</div>
                            <div class="text-[10px] mt-1 {{ optional($activeConversation)->id === $conversation->id ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400' }}">{{ $conversation->updated_at->diffForHumans() }}</div>
                        </a>
                    @empty
                        <div class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Belum ada percakapan.
                        </div>
                    @endforelse
                </div>
            </aside>

            <!-- Chat Area -->
            <section class="flex flex-1 flex-col relative w-full">
                <!-- Status Bar -->
                <div class="hidden sm:flex absolute top-4 right-4 z-10 items-center gap-1.5 bg-[#F0FDF4] dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-[#BBF7D0] dark:border-emerald-800/60 shadow-sm animate-fade-in-up">
                    <span class="relative flex h-1.5 w-1.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]"></span>
                    </span>
                    <span class="text-[#16A34A] dark:text-emerald-400 text-xs font-semibold">
                        Online
                    </span>
                </div>

                <div id="chat-messages" class="flex-1 overflow-y-auto px-4 py-6 sm:p-6 w-full">
                    <div class="max-w-3xl mx-auto space-y-5">
                        <!-- Welcome Bubble -->
                        @if ($messages->isEmpty())
                            <div class="flex justify-start items-start gap-2 sm:gap-3 animate-slide-in">
                                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1 shadow-sm">PG</div>
                                <div class="max-w-[85%] sm:max-w-[75%] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">
                                    Halo! 👋 Saya PayGent, asisten penagihan AI kamu.<br/><br/>
                                    Cukup beritahu saya siapa yang ingin ditagih, untuk apa, dan berapa nominalnya.<br/><br/>
                                    <strong>Contoh:</strong> "Tagihkan CV Sentosa Digital 3 juta untuk jasa pembuatan website."
                                </div>
                            </div>
                        @else
                            @foreach ($messages as $message)
                                @if ($message->role === 'user')
                                    <div class="flex justify-end animate-slide-in">
                                        <div class="max-w-[85%] sm:max-w-[75%] bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
                                            {{ $message->content }}
                                        </div>
                                    </div>
                                @else
                                    <div class="flex justify-start items-start gap-2 sm:gap-3 animate-slide-in">
                                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1 shadow-sm">PG</div>
                                        <div class="max-w-[85%] sm:max-w-[75%] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap">{!! nl2br(e($message->content)) !!}</div>
                                    </div>
                                @endif
                            @endforeach
                        @endif

                        <!-- Loading Indicator (Hidden by default) -->
                        <div id="loading-indicator" class="hidden justify-start items-start gap-2 sm:gap-3 animate-slide-in">
                            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1 shadow-sm">PG</div>
                            <div class="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce [animation-delay:0ms]"></span>
                                    <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce [animation-delay:150ms]"></span>
                                    <span class="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce [animation-delay:300ms]"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="p-3 sm:p-4 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shrink-0">
                    <form id="chat-form" class="max-w-3xl mx-auto relative">
                        <input type="hidden" id="conversation-id" value="{{ $activeConversation?->id }}">
                        
                        <input
                            id="chat-input"
                            type="text"
                            placeholder="Ketik tagihan... (misal: Tagih Budi 500rb untuk desain)"
                            class="w-full bg-slate-100 dark:bg-[#1E293B] border-none text-slate-900 dark:text-white text-sm rounded-2xl pl-5 pr-14 py-3.5 focus:ring-2 focus:ring-blue-500 shadow-inner"
                            autocomplete="off"
                        >
                        <button 
                            type="submit" 
                            id="submit-btn"
                            class="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                    <p class="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">AI Agent Powered by Groq LLaMA-3.3</p>
                </div>
            </section>
        </div>
    </div>

    @push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('chat-form');
            const input = document.getElementById('chat-input');
            const messagesEl = document.getElementById('chat-messages');
            const conversationInput = document.getElementById('conversation-id');
            const submitBtn = document.getElementById('submit-btn');
            const loadingIndicator = document.getElementById('loading-indicator');
            let isLoading = false;

            // Scroll to bottom on load
            messagesEl.scrollTop = messagesEl.scrollHeight;

            function appendMessage(role, content, id = null) {
                const wrapper = document.createElement('div');
                wrapper.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start items-start gap-2 sm:gap-3'} animate-slide-in`;
                if (id) wrapper.id = id;

                let html = '';
                if (role === 'user') {
                    html = `
                        <div class="max-w-[85%] sm:max-w-[75%] bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
                            ${content}
                        </div>
                    `;
                } else {
                    html = `
                        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1 shadow-sm">PG</div>
                        <div class="bubble-content max-w-[85%] sm:max-w-[75%] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap">${content}</div>
                    `;
                }

                wrapper.innerHTML = html;
                
                const container = messagesEl.querySelector('.max-w-3xl');
                // Insert before loading indicator
                container.insertBefore(wrapper, loadingIndicator);
                messagesEl.scrollTop = messagesEl.scrollHeight;
                
                return role === 'user' ? wrapper : wrapper.querySelector('.bubble-content');
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const message = input.value.trim();
                if (!message || isLoading) return;

                isLoading = true;
                submitBtn.disabled = true;
                input.value = '';
                
                // Show user message
                appendMessage('user', message);
                
                // Show loading
                loadingIndicator.classList.remove('hidden');
                loadingIndicator.classList.add('flex');
                messagesEl.scrollTop = messagesEl.scrollHeight;

                let assistantBubble = null;
                let assistantText = '';

                await window.PayGent.streamChat({
                    url: @json(route('chat.stream')),
                    message,
                    conversationId: conversationInput.value || null,
                    onDelta: (delta) => {
                        if (!assistantBubble) {
                            // Hide loading on first chunk
                            loadingIndicator.classList.add('hidden');
                            loadingIndicator.classList.remove('flex');
                            assistantBubble = appendMessage('assistant', '', 'assistant-stream');
                        }
                        assistantText += delta;
                        
                        // Parse simple markdown
                        const formatted = assistantText
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 dark:text-blue-400 underline font-semibold">$1</a>');
                        
                        assistantBubble.innerHTML = formatted;
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    },
                    onError: (msg) => {
                        loadingIndicator.classList.add('hidden');
                        loadingIndicator.classList.remove('flex');
                        if (!assistantBubble) assistantBubble = appendMessage('assistant', '');
                        assistantBubble.innerHTML = `<span class="text-red-500">${msg}</span>`;
                    },
                    onDone: () => {
                        isLoading = false;
                        submitBtn.disabled = false;
                        input.focus();
                        if (!conversationInput.value) {
                            // If new chat, reload to get the ID and history sidebar updated
                            window.location.reload();
                        }
                    },
                });
            });
        });
    </script>
    @endpush
</x-app-layout>
