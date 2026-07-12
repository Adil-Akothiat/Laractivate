<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefreshToken extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'token_hash',
        'expires_at',
        'revoked',
        'user_id',
        'clients_id',
        'metadata'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'revoked' => 'boolean',
            'metadata' => 'array'
        ];
    }

    /**
     * Get the user that owns the refresh token.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
