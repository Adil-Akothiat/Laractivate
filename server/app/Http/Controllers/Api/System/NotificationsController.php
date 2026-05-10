<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index() {
        return response()->json([
            'notifications' => auth()->user()->notifications()->latest()->take(10)->get(),
            'unread_count'  => auth()->user()->unreadNotifications()->count(),
        ]);
    }
    public function markAsRead($id)
    {
        auth()->user()->notifications()->findOrFail($id)->markAsRead();
        return response()->json(['status' => 'success']);
    }
    public function markAllRead() {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'All cleared!']);
    }
}
