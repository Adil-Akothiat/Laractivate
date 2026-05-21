<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\Security\TwoFactorAuthService;
use App\Services\System\SessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class TwoFactorAuthController extends Controller
{
    public function __construct(
        protected TwoFactorAuthService $tfaService,
        protected SessionService $sessionService,
        protected AuthController $authController
    ) {}

    public function verifyAuthentication(Request $request): JsonResponse
    {
        // User is resolved via 'auth:api' + '2fa.challenge' middleware
        $user = auth()->user();

        $metadata = $this->sessionService->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );

        // verifyAndAuthenticate(User $user, string $code, array $metadata)

        $result = $this->tfaService->verifyAndAuthenticate(
            $user, 
            $request->input('code'),
            $metadata
        );

        return $this->authController->respondWithToken(
            $result['access_token'],
            $result['refresh_token'],
            $result['user']
        );
    }
}