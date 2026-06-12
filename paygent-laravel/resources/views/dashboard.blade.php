<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between max-w-6xl mx-auto">
            <div>
                <div class="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                    CFO Mode
                </div>
                <h2 class="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">AI CFO Dashboard</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Revenue intelligence, invoice health, and autonomous follow-up.</p>
            </div>
            <a href="{{ route('chat.index') }}" class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Buat Tagihan via Chat
            </a>
        </div>
    </x-slot>

    <div class="py-6 sm:py-8 bg-[#F8FAFC] dark:bg-[#0B1120]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <!-- Stats KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" id="stats-grid">
                <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 hover-lift">
                    <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Invoice</p>
                    <p class="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white" data-stat="total">{{ $stats['total'] }}</p>
                </div>
                <div class="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-white dark:bg-[#0F172A] p-5 hover-lift">
                    <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Paid</p>
                    <p class="mt-3 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400" data-stat="paid">{{ $stats['paid'] }}</p>
                </div>
                <div class="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-white dark:bg-[#0F172A] p-5 hover-lift">
                    <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending</p>
                    <p class="mt-3 text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400" data-stat="pending">{{ $stats['pending'] }}</p>
                </div>
                <div class="rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-[#0F172A] p-5 hover-lift sm:col-span-2 md:col-span-1">
                    <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Revenue</p>
                    <p class="mt-3 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white line-clamp-1" data-stat="revenue">Rp {{ number_format($stats['revenue'], 0, ',', '.') }}</p>
                </div>
                <div class="rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-[#0F172A] p-5 hover-lift sm:col-span-2 md:col-span-1">
                    <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Outstanding</p>
                    <p class="mt-3 text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 line-clamp-1" data-stat="outstanding">Rp {{ number_format($stats['outstanding'], 0, ',', '.') }}</p>
                </div>
            </div>

            <!-- Content Area -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Recent Invoices Table (Card View on Mobile) -->
                <div class="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm overflow-hidden">
                    <div class="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <h3 class="font-bold text-lg text-slate-900 dark:text-white">Recent Invoice Activity</h3>
                        </div>
                        <a href="{{ route('invoices.index') }}" class="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Lihat semua</a>
                    </div>
                    
                    <!-- Desktop Table -->
                    <div class="hidden sm:block overflow-x-auto">
                        <table class="min-w-[700px] w-full text-sm text-left">
                            <thead class="bg-slate-50 dark:bg-[#0B1120] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="px-6 py-4">Client</th>
                                    <th class="px-6 py-4">Invoice</th>
                                    <th class="px-6 py-4">Amount</th>
                                    <th class="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                                @forelse ($recentInvoices as $invoice)
                                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">{{ $invoice->client_name }}</td>
                                        <td class="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{{ $invoice->invoice_number }}</td>
                                        <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">{{ $invoice->formattedAmount() }}</td>
                                        <td class="px-6 py-4">
                                            <span class="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide {{ $invoice->status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }}">
                                                {{ $invoice->status }}
                                            </span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="4" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">Belum ada invoice. Mulai dari Chat AI.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Card View -->
                    <div class="sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
                        @forelse ($recentInvoices as $invoice)
                            <div class="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold text-slate-900 dark:text-white text-sm">{{ $invoice->client_name }}</span>
                                    <span class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide {{ $invoice->status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }}">
                                        {{ $invoice->status }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span class="font-mono">{{ $invoice->invoice_number }}</span>
                                    <span class="font-bold text-slate-900 dark:text-white text-sm">{{ $invoice->formattedAmount() }}</span>
                                </div>
                            </div>
                        @empty
                            <div class="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada invoice.</div>
                        @endforelse
                    </div>
                </div>

                <!-- AI Summary Card -->
                <div class="rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-blue-950/40 dark:via-[#0F172A] dark:to-emerald-950/20 p-5 sm:p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-5">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                            </div>
                            <h3 class="font-bold text-lg text-slate-900 dark:text-white">CFO Insights</h3>
                        </div>
                        <span class="flex h-2.5 w-2.5 relative">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                    </div>
                    <div id="summary-content" class="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed min-h-[180px]">
                        Menganalisis performa penagihan...
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const summaryEl = document.getElementById('summary-content');
            let summaryText = '';

            window.PayGent.streamSummary({
                url: @json(route('summary.stream')),
                onDelta: (delta) => {
                    summaryText += delta;
                    // parse markdown bold simple
                    const formatted = summaryText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>');
                    summaryEl.innerHTML = formatted;
                },
                onError: (msg) => { summaryEl.textContent = msg; },
            });

            async function refreshStats() {
                try {
                    const res = await fetch(@json(route('summary.stats')));
                    if (!res.ok) return;
                    const data = await res.json();
                    document.querySelector('[data-stat="total"]').textContent = data.total;
                    document.querySelector('[data-stat="paid"]').textContent = data.paid;
                    document.querySelector('[data-stat="pending"]').textContent = data.pending;
                    document.querySelector('[data-stat="revenue"]').textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(data.revenue);
                    document.querySelector('[data-stat="outstanding"]').textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(data.outstanding);
                } catch(e){}
            }

            setInterval(refreshStats, 8000);
        });
    </script>
    @endpush
</x-app-layout>
