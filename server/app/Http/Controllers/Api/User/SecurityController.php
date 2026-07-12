<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Services\Security\JwtService;
use App\Services\Security\TwoFactorAuthService;
use App\Services\User\UserService;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Validation\Rules\Password;
use App\Http\Resources\System\BaseResource;

class SecurityController extends Controller
{
    public function __construct(
        protected JwtService $jwtService,
        protected UserService $userService,
        protected TwoFactorAuthService $tfaService,
    ) {}

    public function changePassword(Request $request):JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $this->userService->changePassword(
            $request->user(),
            $validated['current_password'],
            $validated['password']
        );

        $this->jwtService->invalidateUserTokens($request->user()->id);
        
        return response()->json([
            'message' => 'Password changed successfully! Please log in again.',
        ], 200);
    }

    public function init(): JsonResponse
    {
        $tfaQrcode = $this->tfaService->initializeSetup(auth()->user());
        return (new BaseResource(['tfaQrcode' => $tfaQrcode]))->withMessage('2FA enabled successfully.')->response()->setStatusCode(200);
    }

    public function enable(Request $request):JsonResponse
    {
        $request->validate(['otp' => 'required|string']);
        $data = $this->tfaService->verifyAndEnable(auth()->user(), $request->otp);
        return (new BaseResource($data))->withMessage('2FA enabled successfully.')->response()->setStatusCode(200);
    }

    public function disable(Request $request):JsonResponse
    {
        $request->validate(['password' => 'required|string']);

        $this->tfaService->disable(auth()->user(), $request->password);
        return (new BaseResource([]))->withMessage('2FA disabled successfully.')->response()->setStatusCode(200);
    }

    /**
     * Optional: Allow users to regenerate codes without re-enabling 2FA
     */
    public function regenerateCodes():JsonResponse
    {
        $codes = $this->tfaService->generateRecoveryCodes(auth()->user());
        return (new BaseResource(['recoveryCodes' => $codes]))->withMessage('Recovery codes generated successfully.')->response()->setStatusCode(200);
    }
}