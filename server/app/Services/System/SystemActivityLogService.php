<?php
namespace App\Services\System;

use App\Models\ActivityLog;
use App\Models\User;
use App\Support\DeviceDetector;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SystemActivityLogService
{
    /**
     * Get logs activities with filtering
     */

    public function __construct(
        protected DeviceDetector $deviceDetector
    ) {
        // 
    }

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

    public function log($description, $event, $properties = [], $userId=null)
    {
        $finalUserId = $userId ?? auth()->id();
        if(!$finalUserId):
            return;
        endif;
    
        $request = request();
        $metadata = $this->deviceDetector->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        ActivityLog::create([
            'user_id' => $finalUserId,
            'description' => $description,
            'event' => $event,
            'properties' => [...$metadata, ...$properties],
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent')
        ]);
    }
}