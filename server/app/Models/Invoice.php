<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToClient;

class Invoice extends Model
{
    use HasFactory;
    use BelongsToClient;

    protected $fillable = [
        'client_id',
        'user_id',
        'subtotal',
        'tax_amount',
        'total',
        'currency',
        'status',
        'payment_method_id',
        'tax_rate_id',
        'stripe_invoice_id',
        'hosted_invoice_url',
        'invoice_pdf',
    ];

    protected $casts = [
        'subtotal' => 'integer',
        'tax_amount' => 'integer',
        'total' => 'integer',
    ];

    /**
     * Get the user associated with the invoice.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payment method used for this specific invoice invoice.
     */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Get the tax rate applied to this invoice.
     */
    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}