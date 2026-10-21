<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckScope
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $scope): Response
    {
        $clientId = $request->attributes->get('current_client_id');
        
        // Client id is not allowed on system scope, because we are not dealing with workspace
        if($scope === "system" && $clientId):
            return response()->json(['error' => 'Forbidden. System scope required.'], 403);
        endif;
        
        // Client id is required because we are dealing with system scope
        if($scope === "client" && !$clientId):
            return response()->json(['error' => 'Forbidden. Workspace scope required.'], 403);
        endif;

        // Store it so we may use it inside others methods
        $request->attributes->set('current_scope', $scope);

        return $next($request);
    }
}
