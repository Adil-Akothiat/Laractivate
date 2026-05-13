<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Services\Security\JwtService;
use App\Services\Security\TwoFactorAuthService;
use App\Services\User\UserService;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Validation\Rules\Password;

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
        $qrCodeUrl = $this->tfaService->initializeSetup(auth()->user());
        return response()->json(['qrCodeUrl' => $qrCodeUrl]);
    }

    public function enable(Request $request):JsonResponse
    {
        $request->validate(['otp' => 'required|string']);
        $data = $this->tfaService->verifyAndEnable(auth()->user(), $request->otp);

        return response()->json($data, 200);
    }

    public function disable(Request $request):JsonResponse
    {
        $request->validate(['password' => 'required|string']);

        $this->tfaService->disable(auth()->user(), $request->password);

        return response()->json(['disabled' => true], 200);
    }

    /**
     * Optional: Allow users to regenerate codes without re-enabling 2FA
     */
    public function regenerateCodes():JsonResponse
    {
        $codes = $this->tfaService->generateRecoveryCodes(auth()->user());
        return response()->json(['recovery_codes' => $codes], 200);
    }
}