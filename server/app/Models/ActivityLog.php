<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    protected $fillable = [
        'users_id',
        'description',
        'event',
        'properties',
        'ip_address',
        'user_agent',
    ];

    // It is also a good idea to cast properties to an array 
    // since you are passing an array from the Observer
    protected $casts = [
        'properties' => 'array',
    ];
     public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
