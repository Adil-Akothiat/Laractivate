<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use PragmaRX\Google2FA\Google2FA;
use App\Models\User;
use App\Services\Jwt\JwtService;
use App\Services\User\UserService;

class SecurityController extends Controller
{    
    public function __construct(
        protected JwtService $jwtService,
        protected UserService $userService,
    ) {}

    public function changePassword(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $this->userService->changePassword(
            $user,
            $validated['current_password'],
            $validated['password']
        );
        // Invalidate all existing tokens
        $this->jwtService->invalidateUserTokens($user->id);

        return response()->json([
            'message' => 'Password changed successfully! Please log in again with your new password.',
        ]);
    }

    public function init()
    {
        $user     = auth()->user();
        $google2fa = new Google2FA();
        $secret   = $google2fa->generateSecretKey();

        $user->two_factor_secret = encrypt($secret);
        $user->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl('YourAppName', $user->email, $secret);

        return response()->json(['qrCodeUrl' => $qrCodeUrl], 200);
    }

    public function enable(Request $request)
    {
        $user      = auth()->user();
        $google2fa = new Google2FA();
        $google2fa->setWindow(2);

        $valid = $google2fa->verifyKey(
            decrypt($user->two_factor_secret),
            $request->input('otp')
        );

        if ($valid) {
            $user->two_factor_enabled = true;
            $user->save();
            return response()->json(['enabled' => true], 200);
        }

        return response()->json(['enabled' => false, 'error' => 'Invalid OTP'], 401);
    }
    
    public function disable() {
        $validated = request()->validate([
            'password' => 'required|string',
        ]);
        $user = auth()->user();
        $this->userService->disableTwoFactor($user, $validated['password']);
        return response()->json(['disabled'=> true], 200);
    }
}
