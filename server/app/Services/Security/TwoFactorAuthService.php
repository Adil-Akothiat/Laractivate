<?php
namespace App\Services\Security;

use PragmaRX\Google2FA\Google2FA;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Login;

class TwoFactorAuthService
{
    public function __construct(
        protected Google2FA $google2fa,
        protected JwtService $jwtService
    ) {
        $this->google2fa->setWindow(10);
    }

    /**
     * Start the 2FA setup process.
    */
    public function initializeSetup(User $user): string
    {
        $secret = $this->google2fa->generateSecretKey();

        $user->update([
            'two_factor_secret' => encrypt($secret),
        ]);

        return $this->google2fa->getQRCodeUrl(
            config('app.name', 'Laractivate'),
            $user->email,
            $secret
        );
    }

    /**
     * Verify the OTP and activate 2FA.
     */
    public function verifyAndEnable(User $user, string $otp): array
    {
        $secret = decrypt($user->two_factor_secret);
        $this->google2fa->setWindow(2);

        if (!$this->google2fa->verifyKey($secret, $otp)) {
            return ['success' => false];
        }

        // Generate recovery codes upon successful activation
        $recoveryCodes = $this->generateRecoveryCodes($user);

        $user->update(['two_factor_enabled' => true]);

        return [
            'recoveryCodes' => $recoveryCodes
        ];
    }

    /**
     * Disable 2FA.
     */
    public function disable(User $user, string $password): void
    {
        if (!Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Incorrect password.'],
            ]);
        }

        $user->update([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
        ]);
    }

    /**
     * Generate a set of one-time use recovery codes.
     */
    public function generateRecoveryCodes(User $user): array
    {
        $codes = collect(range(1, 8))->map(function () {
            return Str::random(10) . '-' . Str::random(10);
        });

        $user->update([
            'two_factor_recovery_codes' => encrypt(json_encode($codes->toArray())),
        ]);

        return $codes->toArray();
    }

    protected function verifyOtp(User $user, string $otp): void
    {
        $valid = $this->google2fa->verifyKey(decrypt($user->two_factor_secret), $otp);

        if (!$valid) {
            throw ValidationException::withMessages(['code' => ['Invalid verification code.']]);
        }
    }

    protected function verifyRecoveryCode(User $user, string $code): void
    {
        // Assuming you store recovery codes as a JSON array of hashed values
        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);

        if (!in_array($code, $recoveryCodes)) {
            throw ValidationException::withMessages(['code' => ['Invalid recovery code.']]);
        }

        // IMPORTANT: Recovery codes are one-time use. Remove it!
        $updatedCodes = array_diff($recoveryCodes, [$code]);
        $user->update(['two_factor_recovery_codes' => encrypt(json_encode(array_values($updatedCodes)))]);
    }

    public function verifyAndAuthenticate(User $user, string $code, array $metadata): array
    {
        // 1. Determine if it's a Recovery Code (usually longer/alphanumeric) or OTP (6 digits)
        $isRecoveryCode = strlen($code) > 6;

        if ($isRecoveryCode) {
            $this->verifyRecoveryCode($user, $code);
        } else {
            $this->verifyOtp($user, $code);
        }

        // 2. The rest of the logic remains exactly the same...
        $refreshTokenArray = $this->jwtService->createRefreshToken($user->id, $metadata);
        $token = $this->jwtService->createJwtToken($user, ['rtid' => $refreshTokenArray['id']]);

        event(new Login('api', $user, false));

        return [
            'access_token' => $token,
            'refresh_token' => $refreshTokenArray['token'],
            'user' => $user
        ];
    }
}