<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Services\Auth\JwtService;
use App\Services\System\SystemNotificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class RegistrationService
{
    public function __construct(
        protected SystemNotificationService $notification,
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

            $token        = JWTAuth::fromUser($user);
            $refreshToken = $this->jwtService->createRefreshToken($user->id, $metadata)['token'];
            event(new Registered($user));
            $this->notification->welcome($user, "Welcome {$user->full_name}!", 'Check out your dashboard');
            $this->notification->emailVerification($user, 'Email verification', 'Please verify your mail address!');

            return [
                'access_token'=> $token,
                'refresh_token'=> $refreshToken,
                'user'=> $user
            ];
        });
    }
}