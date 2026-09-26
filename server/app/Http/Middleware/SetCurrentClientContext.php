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
            $clientId = session('current_client_id');
            if(!$clientId):
                $firstClient = $user->clients()->first();
                $clientId = $firstClient?->id;
                
                if ($clientId) {
                    session(['current_client_id' => $clientId]);
                    session()->save();
                }
            endif;
            $request->attributes->set('current_client_id', $clientId);
        }
        return $next($request);
    }
}