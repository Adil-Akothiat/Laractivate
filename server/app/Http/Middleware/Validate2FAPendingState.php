<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class Validate2FAPendingState
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Get the raw header
        $header = $request->header('Authorization');

        // If no header, check if your jwtFromCookie set it in the request attributes or similar
        // But primarily, we want the Bearer token here
        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return response()->json(['code' => 'AUTH_ERROR', 'message' => 'Challenge token missing'], 401);
        }

        $token = str_replace('Bearer ', '', $header);

        // Force JWTAuth to use THIS token, ignoring any previous parsing attempts
        JWTAuth::setToken($token);
        
        // This will trigger your global AuthenticationException handler if it fails
        $user = JWTAuth::authenticate(); 

        $payload = JWTAuth::getPayload();

        if ($payload->get('pending_2fa') !== true) {
            return response()->json(['code' => 'ACCESS_DENIED', 'message' => 'Invalid token type'], 403);
        }

        return $next($request);
    }
}