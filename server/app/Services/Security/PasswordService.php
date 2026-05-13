<?php

namespace App\Services\Security;

use App\Models\User;
use Illuminate\Support\Facades\{DB, Hash};
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use App\Services\System\SystemSupportService;
use App\Services\Security\JwtService;
use App\Notifications\GeneralAppNotification;

class PasswordService
{
    public function __construct(
        protected JwtService $jwtService 
    )
    {
        $this->tokenExpiresDelay = 15; // min
    }
    public function forgotPassword(array $credentials): array
    {
        $email = $credentials['email'];
        $user = User::where('email', $email)->first();

        // Security: If user doesn't exist, don't reveal it. 
        // Just return success or handle appropriately.
        if (!$user) {
            return ['status' => 'success']; 
        }

        $token = Str::random(60);
        
        // Store token
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // Build the URL for your React Frontend
        $resetUrl = config('app.frontend_url', 'http://localhost:5173') . "/reset-password?token={$token}&email=" . urlencode($email);

        // Prepare Notification Details
        $notificationData = [
            'title'   => 'Reset Password Request',
            'message' => 'Click the button below to reset your account password.',
            'url'     => $resetUrl,
            'type'    => 'auth',
            'icon'    => 'key',
            'send_email' => true
        ];

        // Send Notification (Mail + Database)
        $user->notify(new GeneralAppNotification($notificationData));

        // Logging
        SystemSupportService::log(
            'Requested a password reset link', 
            'auth.password_reset_request',
            ['email' => $email],
            $user->id
        );

        return ['token' => $token];
    }

    public function resetPassword(array $credentials): array
    {
        $email = $credentials['email'];
        $token = $credentials['token'];
        $password = $credentials['password'];

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();
        if (!$record || !Hash::check($token, $record->token)) {
            throw ValidationException::withMessages([
                'errors' => ['Invalid token'],
            ]);
        }
        if (Carbon::parse($record->created_at)->diffInMinutes(now()) > $this->tokenExpiresDelay) {
            throw ValidationException::withMessages([
                'errors' => ['Token expired'],
            ]);
        }

        $user = User::where('email', $email)->firstOrFail();
        $user->update(['password'=>$password]);
        event(new PasswordReset($user));

        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
        $this->jwtService->invalidateUserTokens($user->id);
        return ['message' => 'Password has been reset'];
    }

    public function isResetTokenValid(string $email, string $token): bool
    {
        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();
        if (!$record || !Hash::check($token, $record->token)) {
            return false;
        }

        // 2. Check if created more than { tokenExpiresDelay } minutes ago
        $isExpired = Carbon::parse($record->created_at)->addMinutes($this->tokenExpiresDelay)->isPast();
        return !$isExpired;
    }
}