<?php

namespace App\Services\User;

use Jenssegers\Agent\Agent;
use Stevebauman\Location\Facades\Location;
use App\Models\{User, RefreshToken};
use Illuminate\Pagination\LengthAwarePaginator;

class UserSessionService
{
    public function __construct()
    {
        // 
    }
    
    // get Sessions
    public function getSessions(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return RefreshToken::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }
    // revoke session
    public function revokeSession(User $user, string $sessionId): void
    {
        RefreshToken::where('id', $sessionId)
            ->where('user_id', $user->id)
            ->update(['revoked' => true]);
    }

    // revoke all except current
    public function revokeAllExceptCurrent(User $user, string $currentTokenHash): void
    {
        RefreshToken::where('user_id', $user->id)
            ->where('token_hash', '!=', $currentTokenHash)
            ->update(['revoked' => true]);
    }

    // clear history
    public function clearHistory(User $user): void
    {
        RefreshToken::where('user_id', $user->id)
            ->where('revoked', true)
            ->delete();
    }
}