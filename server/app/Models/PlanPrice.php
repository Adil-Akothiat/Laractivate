<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'currency',
        'amount',
        'interval',
        'is_active',
        'stripe_product_id',
        'stripe_price_id',
    ];

    protected $casts = [
        'amount' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get all subscriptions attached to this pricing plan.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}