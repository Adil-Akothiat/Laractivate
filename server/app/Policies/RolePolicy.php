<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RolePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        return false;
    }

    public function detach(User $authUser, Role $role, User $targetUser): bool|Response
    {
        if($role->name === 'SUPER_ADMIN' && $role->users_count < 2):
            return Response::deny('super-admin-sole');
        endif;

        if($targetUser->roles()->count() === 1):
            return Response::deny('last-role');
        endif;

        return Response::allow();
    }
}
