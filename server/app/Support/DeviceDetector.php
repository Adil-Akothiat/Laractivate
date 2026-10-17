<?php

namespace App\Support;

use Jenssegers\Agent\Agent;
use Stevebauman\Location\Facades\Location;

class DeviceDetector
{
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
            // Log exception if needed
        }

        return [
            'country'  => 'Unknown',
            'city'     => 'Unknown',
            'timezone' => null,
        ];
    }
}