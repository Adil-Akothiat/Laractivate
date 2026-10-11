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
            $hasInvalidClient = $clientId && !$user->clients()->whereKey($clientId)->exists();

            if($hasInvalidClient):
                $clientId = null;
                session()->forget('current_client_id');
            endif;

            if(!$clientId):
                $clientId = $user->clients()
                ->orderByRaw('clients.owner_id = ? desc', [$user->id])
                ->orderBy('client_user.created_at')
                ->orderBy('clients.id')
                ->value('clients.id');

                if ($clientId):
                    session(['current_client_id' => $clientId]);
                    session()->save();
                endif;
            endif;

            $request->attributes->set('current_client_id', $clientId);
        }
        return $next($request);
    }
}