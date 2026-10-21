<?php
namespace App\Services\Auth;

use App\Models\RefreshToken;
use App\Services\Auth\JwtService;
use Illuminate\Auth\Events\{Login, Logout};
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        protected JwtService $jwtService,
    ) {}
     /**
     * Handle Login Logic.
     * Returns array with tokens/user OR 2FA requirement.
     */
    public function login(array $credentials, array $metadata): array
    {
        if (!JWTAuth::attempt($credentials)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials']]);
        }

        $user  = auth()->user();
        if (!$user) {
            throw ValidationException::withMessages(['email' => ['User account could not be found.']]);
        }
        $refreshTokenArray = $this->jwtService->createRefreshToken($user->id, $metadata);
        $refreshToken = $refreshTokenArray['token'];
        $id = $refreshTokenArray['id'];
        // $token = JWTAuth::claims(['rtid' => $id])->attempt($credentials);
        $token = $this->jwtService->createJwtToken($user, ['rtid'=>$id]);
        
        if (!$user->is_active) {
            JWTAuth::setToken($token)->invalidate();
            throw ValidationException::withMessages(['email' => ['Account disabled! Please contact an administrator.']]);
        }

        // Handle 2FA Requirement
        if ($user->two_factor_enabled) {
            $challengeToken = $this->jwtService->createJwtToken($user, ['pending_2fa' => true], 5);
            return [
                'requires_2fa' => true,
                'challenge_token' => $challengeToken, // Replacing the encrypted ID with a JWT
                'id' => encrypt($user->id) // Optional: keep if your frontend logic requires it
            ];
            return [
                'requires_2fa' => true,
                'id' => encrypt($user->id)
            ];
        }
        // Fire Business Events for log tracker
        event(new Login('api', $user, false));
        return [
            'requires_2fa' => false,
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'user' => $user
        ];
    }

    public function logout(?string $accessToken, ?string $refreshTokenString): void
    {
        $user = auth()->user();
        if($accessToken):
            JWTAuth::setToken($accessToken)->invalidate();
        endif;
        if($refreshTokenString):
            RefreshToken::where('token_hash', hash('sha256', $refreshTokenString))->delete();
        endif;
        if ($user):
            // 3. Fire Logout Event
            event(new Logout('api', $user, false));
        endif;
    }
}