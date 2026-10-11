<?php

namespace App\Http\Middleware;

use App\Models\Client;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        Log::info('test');
        $clientId = $request->attributes->get('current_client_id');
        Log::info('client id', ['client_id'=> $clientId]);

        // Super admin — platform-wide bypass
        if($user->hasSystemPermission('all')):
            return $next($request);
        endif;

        // $clientId = $request->attributes->get('current_client_id');
        // Log::inf('client id', ['client_id'=> $clientId]);
        if($clientId):
            $client = Client::find($clientId);
            if($client && $client->owner_id === $user->id):
                return $next($request);
            endif;
        endif;

        foreach($permissions as $permission):
            $hasAccess = $clientId ? $user->hasClientPermission($permission, $clientId) : $user->hasSystemPermission($permission);

            if($hasAccess):
                return $next($request);
            endif;

        endforeach;
        return response()->json(['error' => 'Forbidden'], 403);
    }
}
