<?php

namespace App\Http\Middleware;

use App\Models\Client;
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
        
        // Super admin — platform-wide bypass
        if ($user->hasSystemPermission('all')) {
            return $next($request);
        }
        
        $clientId = $request->attributes->get('current_client_id');

        // Workspace owner bypasses permission checks within their own client
        if ($clientId) {
            $client = Client::find($clientId);
            if ($client && $client->owner_id === $user->id) {
                return $next($request);
            }
        }

        // Check permissions based on whether we are in a workspace or system context
        foreach ($permissions as $permission) {
            $permission = trim($permission);

            $hasAccess = $clientId 
                ? $user->hasClientPermission($permission, $clientId) 
                : $user->hasSystemPermission($permission);

            if ($hasAccess) {
                return $next($request);
            }
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }
}