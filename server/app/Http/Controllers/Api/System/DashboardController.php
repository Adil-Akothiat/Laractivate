<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Services\System\SystemDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected SystemDashboardService $service
    ) {}

    /**
     * Handle the dashboard data request.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $this->service->getSuperAdminDashboardData($request->user()),
            200
        );
    }
}