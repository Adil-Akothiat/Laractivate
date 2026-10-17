<?php
namespace App\Exceptions;

use App\Models\User;
use App\Services\System\SystemActivityLogService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\{TokenExpiredException, TokenInvalidException};
use Tymon\JWTAuth\Facades\JWTAuth;

class ApiExceptionHandler
{
    public static function handleAuthenticationException(AuthenticationException $e, Request $request)
    {
        // Try to find the specific JWT reason
        $token = $request->cookie('access_token');
        if (!$token) {
            return response()->json(['code' => 'TOKEN_MISSING'], 401);
        }
        try {
            JWTAuth::setToken($token)->authenticate();
        } catch (TokenExpiredException $e) {
            return response()->json(['code' => 'EXPIRED_TOKEN'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['code' => 'INVALID_TOKEN'], 401);
        } catch (\Exception $e) {
            return response()->json(['code' => 'UNAUTHENTICATED'], 401);
        }

        return response()->json(['code' => 'UNAUTHENTICATED'], 401);
    }

    /**
     * Handle the ValidationExceptions thrown by our Services.
     */
    public static function handleValidationException(ValidationException $e)
    {
        return response()->json([
            'code' => 'VALIDATION_FAILED',
            'errors' => $e->errors()
        ], 422);
    }

    public static function handleThrottleException(ThrottleRequestsException $e, Request $request)
    {
        // Your logic for logging lockout is solid. 
        // Just ensure $request->email exists (usually for login/forgot password)
        $user = User::where('email', $request->input('email'))->first();
        
        if($user) {
            (new SystemActivityLogService())->log(
                'Account temporarily locked (Too many failed attempts)', 
                'auth.lockout',
                ['ip' => $request->ip()],
                $user->id
            );
        }

        return response()->json([
            'code' => 'TOO_MANY_REQUESTS',
            'message' => 'Too many attempts.',
            'retry_after' => $e->getHeaders()['Retry-After'] ?? 60
        ], 429);
    }
    public static function handleAuthorizationException($e)
    {
        // If you used Response::deny('super-admin-sole'), 
        // the message is stored inside the exception.
        $message = $e->getMessage();
        return response()->json([
            'code' => 'FORBIDDEN',
            'message' => $message
        ], 403);
    }
}