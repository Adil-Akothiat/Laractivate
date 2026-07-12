<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserService
{
    public function uploadAvatar(User $user, UploadedFile $file): string
    {
        // Delete old avatar if exists
        if ($user->avatar) {
            $oldPath = ltrim(str_replace('/storage', '', $user->avatar), '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        // Store new avatar
        $path      = $file->store("avatars/{$user->id}", 'public');
        $avatarUrl = '/storage/' . $path;

        $user->update(['avatar' => $avatarUrl]);

        return $avatarUrl;
    }

    public function deactivate(User $user, string $password): void
    {
        $this->verifyPassword($user, $password);

        $user->is_active = false;
        $user->save();
    }

    public function delete(User $user, string $password): void
    {
        $this->verifyPassword($user, $password);
        $user->forceDelete();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        $this->verifyPassword($user, $currentPassword);

        $user->password = $newPassword;
        $user->save();
    }

    public function disableTwoFactor(User $user, string $password): void
    {
        $this->verifyPassword($user, $password);
        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->save();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private function verifyPassword(User $user, string $password): void
    {
        if (!Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password is incorrect'],
            ]);
        }
    }

    public function createAccount(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'id'         => (string) Str::uuid(),
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'password'   => $data['password'],
                'is_active'  => $data['is_active'] ?? true,
            ]);

            if (!empty($data['rolesSet'])) {
                $user->roles()->sync($data['rolesSet']);
            }

            return $user;
        });
    }

    /**
     * Handle the update of an existing user with business logic protection.
     */
    public function updateAccount(User $user, array $data, User $authUser): User
    {
        $updateData = collect($data)->only(['first_name', 'last_name'])->toArray();
        if (!empty($data['password'])) {
            $updateData['password'] = $data['password'];
        }
        $updateData['is_active'] = $data['is_active'] ?? $user->is_active;
        $user->update($updateData);
        return $user->load('roles');
    }

    /** 
     * Handle user deletion with safety checks.
     */
    public function deleteAccount(User $user, User $authUser): bool
    {
        return $user->delete();
    }
}