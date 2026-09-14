<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // public function handle(Request $request, Closure $next): Response
    // {
    //     return $next($request);
    // }
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if (!$user->canAccessFeature($feature)) {
            return response()->json([
                'code'    => 'FEATURE_NOT_INCLUDED',
                'message' => "Your current plan does not support the '{$feature}' feature. Please upgrade.",
            ], 403);
        }

        return $next($request);
    }
}
