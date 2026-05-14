<?php
namespace App\Services\System;

use App\Models\{User, ActivityLog};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ActivityLogService
{
    /**
     * Get logs activities with filtering
     */
    public function getActivities(User $user, array $params = []): LengthAwarePaginator
    {
        return $user->activityLogs()
            ->latest()
            // Search by description or event
            ->when($params['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('event', 'like', "%{$search}%");
                });
            })
            // Filter by log status/type if applicable
            ->when($params['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->paginate(2)
            ->withQueryString();
    }
}