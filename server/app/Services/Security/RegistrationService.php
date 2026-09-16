<?php

namespace App\Services\Security;

use App\Models\User;
use App\Services\Security\JwtService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class RegistrationService
{
    public function __construct(
        protected JwtService $jwtService
    ){}
    public function register(array $credentials, $metadata): array
    {
        return DB::transaction(function () use($credentials, $metadata) {
            $user = User::create([
                'id'         => (string) Str::uuid(),
                'first_name' => $credentials['first_name'],
                'last_name'  =>  $credentials['last_name'],
                'email'      =>  $credentials['email'],
                'password'   =>  $credentials['password'],
                'is_active'  => true,
            ]);

            event(new Registered($user));
            $token        = JWTAuth::fromUser($user);
            $refreshToken = $this->jwtService->createRefreshToken($user->id, $metadata)['token'];

            return [
                'access_token'=> $token,
                'refresh_token'=> $refreshToken,
                'user'=> $user
            ];
        });
    }
}