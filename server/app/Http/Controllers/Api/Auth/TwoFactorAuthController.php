<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Services\Jwt\JwtService;
use Illuminate\Auth\Events\Login;
use App\Services\System\SessionService;

class TwoFactorAuthController extends Controller
{
    public function __construct(
        protected JwtService $jwtService,
        protected AuthController $auth,
        protected SessionService $sessionService
    ){}
    
    public function verifyAuthentication(Request $request)
    {
        $google2fa = new Google2FA();
        $google2fa->setWindow(10);

        // Decrypt the user_id blob
        $userId = decrypt($request->input('user_id'));
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $valid = $google2fa->verifyKey(
            decrypt($user->two_factor_secret),
            $request->input('otp')
        );
        if(!$valid):
            return response()->json(['message' => 'Invalid Credentials'], 401);
        endif;
        $metadata = $this->sessionService->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        
        $refreshTokenArray = $this->jwtService->create($user->id, $metadata);
        $refreshToken = $refreshTokenArray['token'];
        $id = $refreshTokenArray['id'];
        $token = JWTAuth::claims(['rtid' => $id])->attempt($credentials);

        event(new Login('api', $user, false));
        return $this->auth->respondWithToken($token, $refreshToken, $user);
    }

}