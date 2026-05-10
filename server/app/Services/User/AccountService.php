<?php

namespace App\Services\User;

use Illuminate\Http\{Request, JsonResponse};
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AccountService
{
    public function __construct()
    {
        // 
    }
    /**
     * Handle the creation of a new user.
     */
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

            if (!empty($data['roles'])) {
                $user->roles()->sync($data['roles']);
            }

            return $user;
        });
    }

    /**
     * Handle the update of an existing user with business logic protection.
     */
    public function updateAccount(User $user, array $data, User $authUser): User
    {
        // Guard: Prevent modifying the primary owner by others
        if ($user->owner && $authUser->id !== $user->id) {
            throw ValidationException::withMessages([
                'user' => ['The primary owner cannot be modified by other admins.']
            ]);
        }
        return DB::transaction(function () use ($user, $data, $authUser) {
            $updateData = collect($data)->only(['first_name', 'last_name'])->toArray();
            if (!empty($data['password'])) {
                $updateData['password'] = $data['password'];
            }

            // Guard: Self-protection logic
            // An account admin cannot change their own roles or active status via this endpoint
            if ($authUser->id !== $user->id) {
                if (isset($data['is_active'])) {
                    $updateData['is_active'] = $data['is_active'];
                }
                if (isset($data['roles'])) {
                    $user->roles()->sync($data['roles']);
                }
            }
            $user->update($updateData);
            return $user->load('roles');
        });
    }

    /**
     * Handle user deletion with safety checks.
     */
    public function deleteAccount(User $user, User $authUser): bool
    {
        if ($authUser->id === $user->id) {
            throw ValidationException::withMessages(['user' => ['You cannot delete your own account.']]);
        }
        if ($user->owner) {
            throw ValidationException::withMessages(['user' => ['The primary owner cannot be deleted.']]);
        }
        return $user->delete();
    }
}