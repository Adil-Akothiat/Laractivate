<?php

namespace App\Services\System;

use Illuminate\Http\{Request, JsonResponse};
use Jenssegers\Agent\Agent;
use Stevebauman\Location\Facades\Location;
use App\Models\{User, RefreshToken};
use App\Http\Resources\Security\SessionResource;
use Illuminate\Pagination\LengthAwarePaginator;

class SessionService
{
    public function __construct()
    {
        // 
    }
    public function buildMetadata(string $userAgent, string $ip, string $secChUa = ''): array
    {
        $agent = new Agent();
        $agent->setUserAgent($userAgent);

        $browser = $this->resolveBrowser($agent, $secChUa);
        $geo     = $this->resolveGeo($ip);

        return [
            'device'           => $agent->isDesktop() ? 'desktop' : ($agent->isTablet() ? 'tablet' : 'mobile'),
            'device_name'      => $agent->deviceType() ?: null,
            'browser'          => $browser,
            'browser_version'  => $agent->version($browser) ?: null,
            'platform'         => $agent->platform() ?: 'Unknown',
            'platform_version' => $agent->version($agent->platform()) ?: null,
            'ip'               => $ip,
            'user_agent'       => $userAgent,
            'country'          => $geo['country'] ?? null,
            'city'             => $geo['city'] ?? null,
            'timezone'         => $geo['timezone'] ?? null,
        ];
    }

    private function resolveBrowser(Agent $agent, string $uaHint): string
    {
        return match(true) {
            str_contains($uaHint, 'Brave') => 'Brave',
            str_contains($uaHint, 'Edg')   => 'Edge',
            str_contains($uaHint, 'Opera') => 'Opera',
            default                         => $agent->browser() ?: 'Unknown',
        };
    }

    private function resolveGeo(?string $ip): array
    {
        // Handle localhost/testing IPs which usually return false
        if ($ip === '127.0.0.1' || $ip === '::1' || !$ip) {
            return [
                'country'  => 'Localhost',
                'city'     => 'Local',
                'timezone' => config('app.timezone'),
            ];
        }

        try {
            $position = Location::get($ip);

            if ($position) {
                return [
                    'country'  => $position->countryName,
                    'city'     => $position->cityName,
                    'timezone' => $position->timezone,
                ];
            }
        } catch (\Exception $e) {
            // Log error if needed: Log::error($e->getMessage());
        }

        return [
            'country'  => 'Unknown',
            'city'     => 'Unknown',
            'timezone' => null,
        ];
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