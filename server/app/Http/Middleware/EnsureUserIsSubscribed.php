<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsSubscribed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // 🟢 Guard: If the user is not authenticated, or doesn't have an active subscription
        if (!$user || !$user->isSubscribed()) {
            return response()->json([
                'error' => 'SUBSCRIPTION_REQUIRED',
                'message' => 'Please upgrade your plan to access this premium feature.'
            ], 403); // 403 Forbidden is the standard HTTP status code for this
        }

        return $next($request);
    }
}