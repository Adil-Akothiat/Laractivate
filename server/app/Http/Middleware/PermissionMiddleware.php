<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        if($user->hasPermission('all')):
            return $next($request);
        endif;
        foreach($permissions as $permission):
            if($user->hasPermission($permission)):
                return $next($request);
            endif;
        endforeach;
        return response()->json(['error' => 'Forbidden'], 403);
    }
}
