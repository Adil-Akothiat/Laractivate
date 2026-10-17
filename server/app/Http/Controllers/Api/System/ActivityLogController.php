<?php
namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\ActivityLogCollection;
use App\Models\User;
use App\Services\System\SystemActivityLogService;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function __construct(
        protected SystemActivityLogService $activityLogService
    ) {}

    public function index(Request $request): ActivityLogCollection
    {
        // Pass all request params (search, status, etc.)
        $logs = $this->activityLogService->getActivities(
            $request->user(), 
            $request->all()
        );
        return new ActivityLogCollection($logs);
    }

    public function show(Request $request, User $user): ActivityLogCollection
    {
        $logs = $this->activityLogService->getActivities(
            $user, 
            $request->all()
        );
        return new ActivityLogCollection($logs);
    }
}