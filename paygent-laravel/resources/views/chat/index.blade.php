<x-app-layout>
    <div class="flex flex-col h-[calc(100dvh-3.5rem)] bg-[#F8FAFC] dark:bg-[#0B1120]">
        <!-- Mobile Header (Hidden on Desktop) -->
        <div class="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
                <x-application-logo class="h-8 w-8 rounded-xl shadow-sm shadow-blue-500/20" />
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
                <div id="conversation-history" class="flex-1 overflow-y-auto p-3 space-y-1">
                    @forelse ($conversations as $conversation)
                        <a href="{{ route('chat.index', ['conversation' => $conversation->id]) }}"
                           data-conversation-id="{{ $conversation->id }}"
                           class="block rounded-xl px-3 py-2.5 text-sm transition-all {{ optional($activeConversation)->id === $conversation->id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' }}">
                            <div class="font-semibold truncate">{{ $conversation->title }}</div>
                            <div data-conversation-time class="text-[10px] mt-1 {{ optional($activeConversation)->id === $conversation->id ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400' }}">{{ $conversation->updated_at->diffForHumans() }}</div>
                        </a>
                    @empty
                        <div id="conversation-empty-state" class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
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
                                <x-application-logo class="h-8 w-8 rounded-xl shrink-0 mt-1 shadow-sm shadow-blue-500/20" />
                                <div class="max-w-[85%] sm:max-w-[75%] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">
                                    Halo! 👋 Saya PayGent, asisten penagihan AI kamu.<br/><br/>
                                    Cukup beritahu saya siapa yang ingin ditagih, untuk apa, berapa nominalnya, dan nomor WhatsApp klien.<br/><br/>
                                    <strong>Contoh:</strong> "Tagihkan CV Sentosa Digital 3 juta untuk jasa pembuatan website ke nomor 082265588823."
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
                                        <x-application-logo class="h-8 w-8 rounded-xl shrink-0 mt-1 shadow-sm shadow-blue-500/20" />
                                        <div class="assistant-message max-w-[92%] sm:max-w-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm" data-assistant-content="{{ e($message->content) }}"></div>
                                    </div>
                                @endif
                            @endforeach
                        @endif

                        <!-- Loading Indicator (Hidden by default) -->
                        <div id="loading-indicator" class="hidden justify-start items-start gap-2 sm:gap-3 animate-slide-in">
                            <x-application-logo class="h-8 w-8 rounded-xl shrink-0 mt-1 shadow-sm shadow-blue-500/20" />
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
                            placeholder="Ketik tagihan... (misal: Tagih Budi 500rb untuk desain ke nomor 081234567890)"
                            class="w-full bg-slate-100 dark:bg-[#1E293B] border-none text-slate-900 dark:text-white text-sm rounded-2xl pl-5 pr-28 py-3.5 focus:ring-2 focus:ring-blue-500 shadow-inner"
                            autocomplete="off"
                        >
                        <button
                            type="button"
                            id="voice-btn"
                            class="absolute right-12 top-1.5 bottom-1.5 w-10 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ucapkan tagihan"
                            aria-label="Ucapkan tagihan"
                        >
                            <svg id="voice-icon-idle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                            <span id="voice-icon-active" class="hidden relative flex h-3 w-3">
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span class="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
                            </span>
                        </button>
                        <button 
                            type="submit" 
                            id="submit-btn"
                            class="absolute right-1.5 top-1.5 bottom-1.5 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-400"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                    <p id="voice-status" class="hidden text-center text-[10px] text-blue-500 dark:text-blue-400 mt-2 font-semibold">Mendengarkan suara...</p>
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
            const voiceBtn = document.getElementById('voice-btn');
            const voiceStatus = document.getElementById('voice-status');
            const voiceIconIdle = document.getElementById('voice-icon-idle');
            const voiceIconActive = document.getElementById('voice-icon-active');
            const loadingIndicator = document.getElementById('loading-indicator');
            const historyList = document.getElementById('conversation-history');
            const chatIndexUrl = @json(route('chat.index'));
            let isLoading = false;
            let recognition = null;
            let isListening = false;

            function setHistoryItemStyles(link, active) {
                link.className = active
                    ? 'block rounded-xl px-3 py-2.5 text-sm transition-all bg-blue-600 text-white shadow-md'
                    : 'block rounded-xl px-3 py-2.5 text-sm transition-all text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

                const timeEl = link.querySelector('[data-conversation-time]');
                if (timeEl) {
                    timeEl.className = active
                        ? 'text-[10px] mt-1 text-blue-200'
                        : 'text-[10px] mt-1 text-slate-500 dark:text-slate-400';
                }
            }

            function addConversationToHistory(conversationId, title) {
                if (!historyList || !conversationId) return;

                document.getElementById('conversation-empty-state')?.remove();

                historyList.querySelectorAll('[data-conversation-id]').forEach((link) => {
                    setHistoryItemStyles(link, false);
                });

                const existing = historyList.querySelector(`[data-conversation-id="${conversationId}"]`);
                if (existing) {
                    existing.remove();
                }

                const link = document.createElement('a');
                link.href = `${chatIndexUrl}?conversation=${encodeURIComponent(conversationId)}`;
                link.dataset.conversationId = conversationId;
                setHistoryItemStyles(link, true);
                link.innerHTML = `
                    <div class="font-semibold truncate">${escapeHtml(title || 'Percakapan baru')}</div>
                    <div data-conversation-time class="text-[10px] mt-1 text-blue-200">baru saja</div>
                `;

                historyList.prepend(link);
            }

            function escapeHtml(value) {
                return String(value ?? '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            }

            function formatCurrency(amount) {
                const number = Number(String(amount ?? '').replace(/[^\d]/g, ''));
                if (!number) return null;

                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                }).format(number);
            }

            function cleanInvoiceDescription(value) {
                return String(value ?? '')
                    .replace(/^[\s/:;,-]*(deskripsi|item|jasa|pesan\s*invoice)\s*[:\-]?\s*/i, '')
                    .replace(/\s+(ke\s+)?(no\.?|nomor|wa|whatsapp|nomor\s*(wa|whatsapp)|hp)\b.*$/i, '')
                    .trim();
            }

            function findJsonObjectContaining(text, key) {
                const keyIndex = text.indexOf(`"${key}"`);
                if (keyIndex === -1) return null;

                const start = text.lastIndexOf('{', keyIndex);
                if (start === -1) return null;

                let depth = 0;
                let inString = false;
                let escaped = false;

                for (let index = start; index < text.length; index += 1) {
                    const char = text[index];

                    if (inString) {
                        if (escaped) {
                            escaped = false;
                        } else if (char === '\\') {
                            escaped = true;
                        } else if (char === '"') {
                            inString = false;
                        }
                        continue;
                    }

                    if (char === '"') {
                        inString = true;
                    } else if (char === '{') {
                        depth += 1;
                    } else if (char === '}') {
                        depth -= 1;
                        if (depth === 0) {
                            const raw = text.slice(start, index + 1);
                            try {
                                return { raw, data: JSON.parse(raw) };
                            } catch {
                                return null;
                            }
                        }
                    }
                }

                return null;
            }

            function extractPaymentData(text) {
                const jsonMatch = findJsonObjectContaining(text, 'payment_url');
                const jsonData = jsonMatch?.data ?? {};
                const urlMatch = text.match(/https?:\/\/[^\s<>"')]+/i);
                const amountMatch = text.match(/(?:nominal|total|amount|nominal_rupiah)\s*:?\s*(?:Rp\s*)?([\d.]+)/i);
                const invoiceMatch = text.match(/(?:no\.?\s*invoice|invoice(?:\s*number)?|invoice_number)\s*:?\s*([A-Z0-9-]+)/i);
                const clientMatch = text.match(/(?:klien|nama_klien|nama\s+klien)\s*:?\s*([^\n]+)/i);
                const itemMatch = text.match(/(?:item|jasa|deskripsi|item_deskripsi|pesan\s*invoice)\s*:?\s*([^\n]+)/i);

                const paymentUrl = jsonData.payment_url ?? urlMatch?.[0]?.replace(/[.,;]+$/, '');
                const amount = jsonData.nominal_rupiah
                    ?? jsonData.amount
                    ?? jsonData.order?.amount
                    ?? amountMatch?.[1];

                if (!paymentUrl) return null;

                return {
                    rawJson: jsonMatch?.raw ?? null,
                    paymentUrl,
                    invoiceNumber: jsonData.invoice_number ?? invoiceMatch?.[1] ?? null,
                    clientName: jsonData.nama_klien ?? clientMatch?.[1]?.trim() ?? null,
                    itemDescription: cleanInvoiceDescription(jsonData.item_deskripsi ?? itemMatch?.[1] ?? null),
                    whatsappNumber: jsonData.whatsapp_number ?? null,
                    whatsappMessage: jsonData.whatsapp_message ?? null,
                    amount,
                    formattedAmount: formatCurrency(amount),
                };
            }

            function formatBasicText(text) {
                return escapeHtml(text)
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline font-semibold">$1</a>')
                    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline font-semibold break-all">$2</a>')
                    .replace(/\n/g, '<br>');
            }

            function cleanPaymentIntro(text, payment) {
                let cleaned = text;
                if (payment.rawJson) cleaned = cleaned.replace(payment.rawJson, '');
                cleaned = cleaned.replace(payment.paymentUrl, '');

                return cleaned
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line && !/^(item|jasa|deskripsi|nominal|total|amount|no\.?\s*invoice|invoice|link pembayaran|payment)/i.test(line))
                    .join('\n')
                    .trim();
            }

            function renderPaymentCard(payment) {
                const amount = payment.formattedAmount ?? 'Nominal belum terbaca';
                const clientName = payment.clientName ?? 'Klien';
                const itemDescription = payment.itemDescription ?? 'Detail tagihan';
                const invoiceNumber = payment.invoiceNumber ?? 'Invoice baru';
                const whatsappMessage = payment.whatsappMessage ?? `Halo ${clientName},\n\nBerikut tagihan untuk ${itemDescription}.\nNominal: ${amount}\nNo. Invoice: ${invoiceNumber}\n\nSilakan lakukan pembayaran melalui link berikut:\n${payment.paymentUrl}\n\nTerima kasih.`;
                const whatsappUrl = payment.whatsappNumber
                    ? `https://wa.me/${encodeURIComponent(payment.whatsappNumber)}?text=${encodeURIComponent(whatsappMessage)}`
                    : payment.paymentUrl;
                const primaryButtonLabel = payment.whatsappNumber ? 'Tagih Sekarang' : 'Buka Link Pembayaran';

                return `
                    <div class="overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-gradient-to-br from-white via-blue-50/80 to-cyan-50/80 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20 shadow-sm">
                        <div class="px-4 py-4 sm:px-5 sm:py-5">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">Payment Link Siap</p>
                                    <h3 class="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">${escapeHtml(amount)}</h3>
                                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${escapeHtml(invoiceNumber)}</p>
                                </div>
                                <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Menunggu pembayaran</span>
                            </div>

                            <div class="mt-4 grid gap-3 rounded-2xl bg-white/75 p-3 text-sm text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-950/30 dark:text-slate-200 dark:ring-slate-800">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tujuan</p>
                                    <p class="font-bold text-slate-900 dark:text-white">${escapeHtml(clientName)}</p>
                                </div>
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Pesan Invoice</p>
                                    <p class="font-medium">${escapeHtml(itemDescription)}</p>
                                </div>
                            </div>

                            <div class="mt-4 flex flex-col gap-2 sm:flex-row">
                                <a href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
                                    ${escapeHtml(primaryButtonLabel)}
                                </a>
                                <button type="button" data-copy-payment-url="${escapeHtml(payment.paymentUrl)}" class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                                    Copy Link
                                </button>
                            </div>

                            <p class="mt-3 break-all rounded-xl bg-slate-950/5 px-3 py-2 text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">${escapeHtml(payment.paymentUrl)}</p>
                        </div>
                    </div>
                `;
            }

            function formatAssistantMessage(text) {
                const payment = extractPaymentData(text);
                if (!payment) return formatBasicText(text);

                const intro = cleanPaymentIntro(text, payment);
                return `
                    ${intro ? `<div class="mb-3">${formatBasicText(intro)}</div>` : ''}
                    ${renderPaymentCard(payment)}
                `;
            }

            document.querySelectorAll('.assistant-message').forEach((message) => {
                message.innerHTML = formatAssistantMessage(message.dataset.assistantContent ?? '');
            });

            document.addEventListener('click', async (event) => {
                const button = event.target.closest('[data-copy-payment-url]');
                if (!button) return;

                const originalText = button.textContent;
                try {
                    await navigator.clipboard.writeText(button.dataset.copyPaymentUrl);
                    button.textContent = 'Link Tersalin';
                } catch {
                    button.textContent = 'Gagal Copy';
                }

                setTimeout(() => {
                    button.textContent = originalText;
                }, 1600);
            });

            // Scroll to bottom on load
            messagesEl.scrollTop = messagesEl.scrollHeight;

            function setVoiceListening(listening) {
                isListening = listening;
                voiceBtn?.classList.toggle('bg-red-50', listening);
                voiceBtn?.classList.toggle('text-red-600', listening);
                voiceBtn?.classList.toggle('dark:text-red-400', listening);
                voiceStatus?.classList.toggle('hidden', !listening);
                voiceIconIdle?.classList.toggle('hidden', listening);
                voiceIconActive?.classList.toggle('hidden', !listening);
            }

            function appendTranscript(transcript) {
                const currentValue = input.value.trim();
                input.value = currentValue ? `${currentValue} ${transcript}` : transcript;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition && voiceBtn) {
                recognition = new SpeechRecognition();
                recognition.lang = 'id-ID';
                recognition.interimResults = true;
                recognition.continuous = false;

                let finalTranscript = '';

                recognition.onstart = () => {
                    finalTranscript = '';
                    setVoiceListening(true);
                };

                recognition.onresult = (event) => {
                    let interimTranscript = '';

                    for (let index = event.resultIndex; index < event.results.length; index += 1) {
                        const transcript = event.results[index][0].transcript.trim();

                        if (event.results[index].isFinal) {
                            finalTranscript += `${transcript} `;
                        } else {
                            interimTranscript += `${transcript} `;
                        }
                    }

                    voiceStatus.textContent = interimTranscript
                        ? `Mendengarkan: ${interimTranscript.trim()}`
                        : 'Mendengarkan suara...';
                };

                recognition.onerror = (event) => {
                    setVoiceListening(false);
                    voiceStatus.textContent = event.error === 'not-allowed'
                        ? 'Izin mikrofon ditolak.'
                        : 'Gagal menangkap suara.';
                    voiceStatus.classList.remove('hidden');

                    setTimeout(() => {
                        voiceStatus.classList.add('hidden');
                        voiceStatus.textContent = 'Mendengarkan suara...';
                    }, 2200);
                };

                recognition.onend = () => {
                    setVoiceListening(false);

                    const transcript = finalTranscript.trim();
                    if (transcript) {
                        appendTranscript(transcript);
                    }
                };

                voiceBtn.addEventListener('click', () => {
                    if (isLoading) return;

                    if (isListening) {
                        recognition.stop();
                        return;
                    }

                    try {
                        recognition.start();
                    } catch {
                        recognition.stop();
                    }
                });
            } else if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.title = 'Speech-to-text belum didukung di browser ini';
                voiceBtn.setAttribute('aria-label', 'Speech-to-text belum didukung di browser ini');
            }

            function appendMessage(role, content, id = null) {
                const wrapper = document.createElement('div');
                wrapper.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start items-start gap-2 sm:gap-3'} animate-slide-in`;
                if (id) wrapper.id = id;

                let html = '';
                if (role === 'user') {
                    html = `
                        <div class="max-w-[85%] sm:max-w-[75%] bg-slate-900 dark:bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
                            ${escapeHtml(content)}
                        </div>
                    `;
                } else {
                    html = `
                        <img src="/icons/paygent.svg" alt="" class="h-8 w-8 rounded-xl shrink-0 mt-1 shadow-sm shadow-blue-500/20">
                        <div class="bubble-content max-w-[92%] sm:max-w-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">${formatAssistantMessage(content)}</div>
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
                const isNewConversation = !conversationInput.value;

                await window.PayGent.streamChat({
                    url: @json(route('chat.stream')),
                    message,
                    conversationId: conversationInput.value || null,
                    onConversation: (conversationId, title) => {
                        conversationInput.value = conversationId;

                        if (isNewConversation) {
                            addConversationToHistory(conversationId, title || message);
                        }
                    },
                    onDelta: (delta) => {
                        if (!assistantBubble) {
                            // Hide loading on first chunk
                            loadingIndicator.classList.add('hidden');
                            loadingIndicator.classList.remove('flex');
                            assistantBubble = appendMessage('assistant', '', 'assistant-stream');
                        }
                        assistantText += delta;
                        
                        assistantBubble.innerHTML = formatAssistantMessage(assistantText);
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    },
                    onError: (msg) => {
                        loadingIndicator.classList.add('hidden');
                        loadingIndicator.classList.remove('flex');
                        if (!assistantBubble) assistantBubble = appendMessage('assistant', '');
                        assistantBubble.innerHTML = `<span class="text-red-500">${escapeHtml(msg)}</span>`;
                    },
                    onDone: () => {
                        isLoading = false;
                        submitBtn.disabled = false;
                        input.focus();
                    },
                });
            });
        });
    </script>
    @endpush
</x-app-layout>
