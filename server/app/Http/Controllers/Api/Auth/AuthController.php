<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\{LoginRequest, RegisterRequest, ForgotPasswordRequest};
use App\Services\System\SessionService;
use App\Services\Jwt\JwtService;
use App\Services\Auth\AuthService;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct(
        protected SessionService $sessionService,
        protected JwtService $jwtService,
        protected AuthService $auth
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $metadata = $this->sessionService->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        $result = $this->auth->login($request->validated(), $metadata);
        if($result['requires_2fa']):
            return response()->json(['next'=> '2FA_VERIFICATION', 'id'=> $result['id']],200);
            endif;
        return $this->respondWithToken(
            $result['access_token'],
            $result['refresh_token'],
            $result['user']
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie($this->jwtService->refresh_token_key);
        $accessToken = $request->cookie($this->jwtService->access_token_key);
        $this->auth->logout($accessToken, $refreshToken);
        return response()->json(['message' => 'Successfully logged out'])
            ->withoutCookie($this->jwtService->access_token_key)
            ->withoutCookie($this->jwtService->refresh_token_key);
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie($this->jwtService->refresh_token_key);
        $result = $this->jwtService->refresh($refreshToken);
        return $this->respondWithToken(
            $result['access_token'],
            $result['refresh_token'],
            $result['user']
        );
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user'=> new UserResource($request->user())], 200);
    }

    public function respondWithToken(string $accessToken, string $refreshToken, $data = null): JsonResponse
    {
        return response()->json(['data' => $data, 'tokens'=> [$accessToken, $refreshToken]])
            ->cookie(
                $this->jwtService->access_token_key, 
                $accessToken,
                $this->jwtService->cookie_ttl,
                '/', 
                null,
                true,
                true,
                false, 
                'Strict'
            )
            ->cookie(
                $this->jwtService->refresh_token_key,
                $refreshToken,
                $this->jwtService->refresh_ttl,
                '/',
                null,
                true,
                true,
                false,
                'Strict'
            );
    }
}