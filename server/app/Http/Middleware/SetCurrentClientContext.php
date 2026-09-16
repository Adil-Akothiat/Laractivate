<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentClientContext
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $clientId = $request->header('X-Client-ID') 
                ?? session('current_client_id') 
                ?? $user->clients()->first()?->id;

            if ($clientId) {
                $request->attributes->set('current_client_id', (int) $clientId);

                session(['current_client_id' => (int) $clientId]);
            }
        }

        return $next($request);
    }
}
