<?php

namespace App\Services\Security;

use App\Models\{User, RefreshToken};
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;


class JwtService
{
    public function __construct()
    {
        $this->refresh_ttl = config('jwt.refresh_ttl');
        $this->cookie_ttl = config('jwt.cookie_ttl');
        $this->refresh_token_key= config('jwt.refresh_token_key');
        $this->access_token_key= config('jwt.access_token_key');
    }

    public function createJwtToken(User $user, array $customClaims = [], ?int $ttl = null): string
    {
        // Access the guard directly (usually 'api')
        $guard = auth('api');

        if ($ttl) {
            $guard->setTTL($ttl);
        }

        return $guard->claims($customClaims)->fromUser($user);
    }

    // create refresh token (to be store in db)
    public function createRefreshToken(string $userId, array $metadata): array
    {
        $token     = Str::random(64); // refresh token
        $expiresAt = Carbon::now()->addMinutes($this->refresh_ttl);
        $refreshToken = RefreshToken::create([
            'token_hash' => hash('sha256', $token),
            'users_id'   => $userId,
            'expires_at' => $expiresAt,
            'revoked'    => false,
            'metadata'   => $metadata
        ]);

        $this->pruneOldTokens($userId);
        return [
            'token'=> $token,
            'id'=> $refreshToken->id
        ];
    }

    public function refresh(string $refreshToken): array
    {
        if (!$refreshToken) {
            throw new AuthenticationException("UNAUTHENTICATED");
        }
        $hashed = hash('sha256', $refreshToken);
        return DB::transaction(function () use ($hashed) {
            $record = RefreshToken::where('token_hash', $hashed)
                ->where('revoked', false)
                ->where('expires_at', '>', now())
                ->lockForUpdate()
                ->first();
            if (!$record) {
                throw new AuthenticationException("INVALID_TOKEN");
            }
            $user      = User::findOrFail($record->users_id);
            $newToken  = Str::random(64);
            $newHashed = hash('sha256', $newToken);
            $record->update([
                'token_hash' => $newHashed,
                'expires_at' => Carbon::now()->addMinutes($this->refresh_ttl),
                'revoked'    => false,
                'updated_at' => now()
            ]);
            $newAccessToken = JWTAuth::fromUser($user);
            return [
                'access_token'  => $newAccessToken,
                'refresh_token' => $newToken,
                'user'          => $user
            ];
        });
    }
    
    private function pruneOldTokens(string $userId): void
    {
        $count = RefreshToken::where('users_id', $userId)->count();

        if ($count > 5) {
            RefreshToken::where('users_id', $userId)
                ->orderBy('created_at', 'asc')
                ->limit($count - 5)
                ->delete();
        }
    }

    public function invalidateUserTokens(string $userId): void
    {
        RefreshToken::where('users_id', $userId)
            ->update(['revoked' => true]);
    }

    public function isTokenRevoked(string $refreshToken):bool
    {
        $revoked = RefreshToken::where('token_hash', $refreshToken)->where('revoked', true)->exists();
        return $revoked;
    }

    public function isTokenExists(string $refreshToken):bool
    {
        $exists = RefreshToken::where('token_hash', $refreshToken)->exists();
        return $exists;
    }

    private function invalidateCurrentToken(): void
    {
        try {
            if (JWTAuth::getToken()) {
                JWTAuth::invalidate(JWTAuth::getToken());
            }
        } catch (\Throwable) {}
    }
    
}