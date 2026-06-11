<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'invoice_number',
        'client_name',
        'item_description',
        'amount',
        'status',
        'payment_url',
        'paid_at',
        'raw_notification',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'paid_at' => 'datetime',
            'raw_notification' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function formattedAmount(): string
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }
}
