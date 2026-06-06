<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array', // 🟢 Casts the JSON features to an array
        'is_active' => 'boolean',
    ];

    /**
     * Get all pricing options associated with this plan.
     */
    public function prices()
    {
        return $this->hasMany(PlanPrice::class);
    }
}
