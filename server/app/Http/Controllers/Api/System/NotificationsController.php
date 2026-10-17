<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\System\{NotificationCollection, BaseResource};


class NotificationsController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        return (new NotificationCollection(
            $user->notifications()->latest()->take(10)->get(),
            $user->unreadNotifications()->count()
        ))
        ->response()
        ->setStatusCode(200);
    }
    public function markAsRead($id):JsonResponse
    {
        auth()->user()->unreadNotifications()->update(['read_at' => now()]);
        return (new BaseResource([]))->withMessage('Notifications viewed!')->response()->setStatusCode(200);
    }

    public function markAllRead():JsonResponse 
    {
        auth()->user()->unreadNotifications->markAsRead();
         return (new BaseResource([]))->withMessage('All cleared')->response()->setStatusCode(200);
    }
}
