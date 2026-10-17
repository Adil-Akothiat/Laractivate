<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\{LoginRequest};
use App\Http\Resources\System\BaseResource;
use App\Http\Resources\User\UserResource;
use App\Services\Auth\{AuthService, JwtService};
use App\Services\Security\RbacService;
use App\Support\DeviceDetector;
use Illuminate\Http\{Request, JsonResponse};

class AuthController extends Controller
{
    public function __construct(
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
            return response()->json([
                'next'=> '2FA_VERIFICATION', 
                'challenge_token'=> $result['challenge_token'],
                'id'=> $result['id'],
            ],200);
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

    public function me(Request $request): JsonResponse
    {
        $clientId = $request->attributes->get('current_client_id');
        new RbacService()->permissionResolver($request->user(), $clientId);
        return (new UserResource($request->user()))->response()->setStatusCode(200);
    }

    public function respondWithToken(string $accessToken, string $refreshToken, $data = null): JsonResponse
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
        return (new BaseResource($data))->response()->setStatusCode(200)->withCookie($refreshTokenCookie)->withCookie($accessTokenCookie);
    }
}