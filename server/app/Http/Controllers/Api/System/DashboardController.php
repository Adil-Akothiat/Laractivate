<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Services\System\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $service
    ) {}

    /**
     * Handle the dashboard data request.
     */
    public function index(Request $request)
    {
        return response()->json(
            $this->service->getUserDashboardData($request->user()),
            200
        );
    }

    public function superAdminIndex(Request $request)
    {
        return response()->json(
            $this->service->getSuperAdminDashboardData($request->user()),
            200
        );
    }
}