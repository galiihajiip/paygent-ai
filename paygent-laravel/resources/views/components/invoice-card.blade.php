<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
    <div class="flex items-center justify-between">
        <div>
            <p class="text-xs uppercase tracking-wide text-slate-500">Invoice</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ $invoice->invoice_number }}</h3>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-semibold {{ $invoice->status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' }}">{{ $invoice->status }}</span>
    </div>

    <div class="mt-6 space-y-3 text-sm">
        <div><span class="text-slate-500">Klien:</span> <span class="font-medium">{{ $invoice->client_name }}</span></div>
        <div><span class="text-slate-500">Item:</span> <span class="font-medium">{{ $invoice->item_description }}</span></div>
        <div><span class="text-slate-500">Nominal:</span> <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ $invoice->formattedAmount() }}</span></div>
        @if ($invoice->payment_url)
            <div>
                <span class="text-slate-500">Link Pembayaran:</span>
                <a href="{{ $invoice->payment_url }}" target="_blank" class="block mt-1 break-all text-blue-600 dark:text-blue-400">{{ $invoice->payment_url }}</a>
            </div>
        @endif
    </div>
</div>
