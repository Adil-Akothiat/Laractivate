<?php
namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\System\ActivityLogService;
use App\Http\Resources\System\ActivityLogCollection;
use App\Models\User;

class ActivityLogController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService
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