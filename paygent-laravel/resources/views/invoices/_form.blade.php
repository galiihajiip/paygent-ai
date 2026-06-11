<form method="POST" action="{{ $action }}" class="space-y-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    <div>
        <x-input-label for="client_name" value="Nama Klien" />
        <x-text-input id="client_name" name="client_name" class="block mt-1 w-full" :value="old('client_name', $invoice->client_name)" required />
        <x-input-error :messages="$errors->get('client_name')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="item_description" value="Deskripsi Item/Jasa" />
        <x-text-input id="item_description" name="item_description" class="block mt-1 w-full" :value="old('item_description', $invoice->item_description)" required />
        <x-input-error :messages="$errors->get('item_description')" class="mt-2" />
    </div>

    <div>
        <x-input-label for="amount" value="Nominal (Rupiah)" />
        <x-text-input id="amount" name="amount" type="number" min="1000" class="block mt-1 w-full" :value="old('amount', $invoice->amount)" required />
        <x-input-error :messages="$errors->get('amount')" class="mt-2" />
    </div>

  @if ($invoice->exists)
    <div>
        <x-input-label for="status" value="Status" />
        <select id="status" name="status" class="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-950">
            @foreach (['PENDING', 'PAID', 'FAILED', 'EXPIRED'] as $status)
                <option value="{{ $status }}" @selected(old('status', $invoice->status) === $status)>{{ $status }}</option>
            @endforeach
        </select>
    </div>
  @endif

    <div>
        <x-input-label for="payment_url" value="Payment URL (opsional)" />
        <x-text-input id="payment_url" name="payment_url" class="block mt-1 w-full" :value="old('payment_url', $invoice->payment_url)" />
    </div>

    <x-primary-button>Simpan</x-primary-button>
</form>
