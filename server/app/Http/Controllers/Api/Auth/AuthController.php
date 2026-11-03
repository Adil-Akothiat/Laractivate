<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\{LoginRequest};
use App\Http\Resources\Auth\AuthSuccessResource;
use App\Http\Resources\System\BaseResource;
use App\Models\User;
use App\Services\Auth\{AuthService, JwtService};
use App\Services\System\SystemRoleService;
use App\Support\DeviceDetector;
use Illuminate\Http\{Request, JsonResponse};
// use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct(
        protected SystemRoleService $systemRole,
        protected DeviceDetector $deviceDetector,
        protected JwtService $jwtService,
        protected AuthService $auth
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $metadata = $this->deviceDetector->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        $result = $this->auth->login($request->validated(), $metadata);
        if($result['requires_2fa']):
            $tfa = [
                'next'=> '2FA_VERIFICATION', 
                'challenge_token'=> $result['challenge_token'],
                'id'=> $result['id']
            ];
            return (new BaseResource(['tfa'=> $tfa]))->response()->setStatusCode(200);
        endif;

        $accessToken = $result['access_token'];
        $refreshToken = $result['refresh_token'];
        $user = $result['user'];

        return $this->respondWithToken(
            $accessToken,
            $refreshToken,
            $user
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->cookie($this->jwtService->refresh_token_key);
        $accessToken = $request->cookie($this->jwtService->access_token_key);
        $this->auth->logout($accessToken, $refreshToken);
        return (new BaseResource([]))->withMessage('Logged out!')->response()->setStatusCode(200)->withoutCookie($this->jwtService->access_token_key)
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

    public function respondWithToken(string $accessToken, string $refreshToken, User $user): JsonResponse
    {
        $refreshTokenCookie = cookie(
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
        $accessTokenCookie = cookie(
            $this->jwtService->access_token_key, 
            $accessToken,
            $this->jwtService->cookie_ttl,
            '/', 
            null,
            true,
            true,
            false, 
            'Strict'
        );
        return (new AuthSuccessResource($user))->response()->setStatusCode(200)->withCookie($refreshTokenCookie)->withCookie($accessTokenCookie);
    }
}