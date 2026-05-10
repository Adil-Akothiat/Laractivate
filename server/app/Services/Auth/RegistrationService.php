<?php

namespace App\Services\Auth;

use App\Models\{User,Role};
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Services\Jwt\JwtService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

            $roleId = Role::where('name', 'Member')->value('id');
            Log::info('Role',['id'=> $roleId]);
            $user->roles()->attach($roleId);

            $token        = JWTAuth::fromUser($user);
            $refreshToken = $this->jwtService->create($user->id, $metadata)['token'];

            return [
                'access_token'=> $token,
                'refresh_token'=> $refreshToken,
                'user'=> $user 
            ];
        });
    }
}