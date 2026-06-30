<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'percentage',
        'is_inclusive',
        'stripe_tax_rate_id',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
        'is_inclusive' => 'boolean',
    ];

    /**
     * Get the invoices associated with this tax rate.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}