<?php
namespace App\Services\System;

use App\Models\{ User,ActivityLog };

class ActivityLogService
{
    // get logs activities
    public function getActivities(User $user)
    {
        return $user->activityLogs()
            ->latest()
            ->paginate(2)
            ->withQueryString();
    }
}