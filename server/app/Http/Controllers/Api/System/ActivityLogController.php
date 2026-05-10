<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\System\ActivityLogService;
use App\Models\User;

class ActivityLogController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService
    ) {}

    // get authenticated user activities
    public function index(Request $request)
    {
        $logs = $this->activityLogService->getActivities($request->user());
        return response()->json(['activityLogs'=> $logs], 200);
        }
        
    // get user by id activities
    public function show(User $user) {
        $logs = $this->activityLogService->getActivities($user);
        return response()->json(['activityLogs'=> $logs], 200);
    }
}