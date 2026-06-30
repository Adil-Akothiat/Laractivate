<?php

namespace App\Services\System;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\User\UserResource;
use App\Models\RefreshToken;

class DashboardService
{
    public function getUserDashboardData($user): array
    {
        return [
            'user' => new UserResource($user),
            'view_type' => 'personal',
            'stats' => $this->getPersonalStats($user),
            // 'recent_activity' => $this->getRecentActivity($user->id),
            'auth_meta' => $this->getAuthMeta(),
        ];
    }
    /**
     * Data for Super Admins (System-wide focus)
     */
    public function getSuperAdminDashboardData($user): array
    {
        return [
            'user' => new UserResource($user),
            'view_type' => 'system',
            'stats' => $this->getGlobalStats($user),
            'charts' => [
                'user_growth' => $this->getUserGrowthData(),
                'composition' => $this->getUserComposition()
            ],
            'system_health' => $this->getSystemHealth(),
            'recent_activity' => $this->getRecentActivity(),
            'auth_meta' => $this->getAuthMeta(),
            'quick_actions'=> $this->getQuickActions()
        ];
    }

    /**
     * Statistics for the Regular User View
     */
    private function getPersonalStats($user): array
    {
        $score = 0;
        if ($user->email_verified_at) $score += 50;
        if ($user->two_factor_enabled) $score += 50;

        return [
            'security_health' => [
                'value' => $score . '%',
                'label' => 'Security Score',
                'icon'  => $score === 100 ? 'shield-check' : 'shield-alert',
                'color' => $score === 100 ? 'success' : 'warning',
                'security_details' => [
                    ['label' => '2FA Authentication', 'enabled' => (bool) $user->two_factor_enabled],
                    ['label' => 'Email Verified',     'enabled' => !is_null($user->email_verified_at)],
                ],
            ],
            'active_sessions' => [
                'value' => $user->refreshTokens()->count(),
                'label' => 'Your Devices',
                'icon'  => 'smartphone'
            ],
            'unread_notifications' => [
                'value' => $user->unreadNotifications()->count(),
                'label' => 'My Alerts',
                'icon'  => 'bell'
            ],
        ];
    }

    /**
     * Statistics for the Super Admin View
     */
    private function getGlobalStats($user): array
    {
        $totalUsers = User::count();
        $active2FA = User::where('two_factor_enabled', true)->count();

        return [
            'total_users' => [
                'value' => $totalUsers,
                'label' => 'Total Users',
                'icon'  => 'users'
            ],
            'active_sessions' => [
                'value' => RefreshToken::count(),
                'label' => 'Global Sessions',
                'icon'  => 'monitor'
            ],
            'tfa_adoption' => [
                'value' => ($totalUsers > 0 ? round(($active2FA / $totalUsers) * 100) : 0) . '%',
                'label' => '2FA Adoption',
                'icon'  => 'shield-check'
            ],
            'unread_notifications' => [
                'value' => $user->unreadNotifications()->count(),
                'label' => 'System Alerts',
                'icon'  => 'bell'
            ],
        ];
    }

    /**
     * Activity logs: Filters by user_id if provided, otherwise returns global logs.
     */
    private function getRecentActivity(string $userId = null): iterable
    {
        $query = ActivityLog::with('user')->latest();

        if ($userId) {
            $query->where('user_id', $userId);
        }
        return $query->take(3)->get()->map(fn($log) => [
            'id'          => $log->id,
            'description' => $log->description,
            'event'       => $log->event,
            'user'        => [
                'id'=>$log->user->id,
                'first_name'=>$log->user->last_name,
                'last_name'=>$log->user->first_name,
                'email'=>$log->user->email
            ],
            'ip'          => $log->ip_address,
            'time'        => $log->created_at->diffForHumans(),
        ]);
    }

    private function getUserGrowthData(): iterable
    {
        // Currently using your static test data approach for the Area Chart
        return [
            ['date' => now()->subDays(6)->format('M d'), 'count' => 4],
            ['date' => now()->subDays(5)->format('M d'), 'count' => 7],
            ['date' => now()->subDays(4)->format('M d'), 'count' => 5],
            ['date' => now()->subDays(3)->format('M d'), 'count' => 12],
            ['date' => now()->subDays(2)->format('M d'), 'count' => 9],
            ['date' => now()->subDays(1)->format('M d'), 'count' => 18],
            ['date' => now()->format('M d'), 'count' => 14],
        ];
    }

    private function getAuthMeta(): array
    {
        return [
            'refresh_expires_in' => config('jwt.refresh_ttl') . ' min',
            'access_expires_in' => config('jwt.ttl') . ' min',
        ];
    }

    /**
    * System Health for Super Admins only
    */
    private function getSystemHealth(): array
    {
        return [
            'php' => [
                'label' => 'PHP Version',
                'value' => PHP_VERSION,
                'status' => 'success'
            ],
            'laravel' => [
                'label' => 'Laravel',
                'value' => app()->version(),
                'status' => 'success'
            ],
            'storage' => [
                'label' => 'Disk Usage',
                'value' => 'Healthy', // You can use disk_free_space('/') if on Linux
                'status' => 'success'
            ],
            'database' => [
                'label' => 'Database',
                'value' => config('database.default'),
                'status' => 'success'
            ],
        ];
    }

    /**
     * Data for the Status Pie Chart (Composition)
     */
    private function getUserComposition(): array
    {
        $active = User::whereNotNull('email_verified_at')->count();
        $pending = User::whereNull('email_verified_at')->count();

        return [
            ['name' => 'Verified', 'value' => $active, 'color' => '#6366f1'], // Your Theme Purple
            ['name' => 'Pending', 'value' => $pending, 'color' => '#e2e8f0'], // Soft Gray
        ];
    }

    public function getQuickActions () : array
    {
        return [
            ['label' => 'Invite User', 'icon' => 'user-plus', 'action' => '/users/invite', 'variant' => 'primary'],
            ['label' => 'Clear Cache', 'icon' => 'refresh-cw', 'action' => 'api/admin/clear-cache', 'variant' => 'outline'],
            ['label' => 'Settings', 'icon' => 'settings', 'action' => '/settings', 'variant' => 'outline'],
        ];
    }
}