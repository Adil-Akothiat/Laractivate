<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\RefreshToken;
use App\Services\Security\JwtService;
use Illuminate\Support\Facades\Log;

class TokenRevocationMiddleware
{
    public function __construct()
    {
        $this->refresh_token_key= config('jwt.refresh_token_key');
        $this->access_token_key= config('jwt.access_token_key');
        $this->jwtService = new JwtService();
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $refreshToken = $request->cookie($this->refresh_token_key);
        $revoked = $this->jwtService->isTokenRevoked(hash('sha256', $refreshToken));
        $exists = $this->jwtService->isTokenExists(hash('sha256', $refreshToken));

        if($revoked || !$exists) {
            return response()->json(['code' => 'UNAUTHENTICATED', 'message' => 'Session has been expired'], 401)
                ->withoutCookie($this->access_token_key)
                ->withoutCookie($this->refresh_token_key);
        }
        return $next($request);
    }
}
