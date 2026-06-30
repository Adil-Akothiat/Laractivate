<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
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
    public function view(User $user, User $model): bool
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
    public function update(User $authUser, User $targetUser, bool|null $isActive = null): bool|Response
    {
        if($isActive === null):
            return Response::allow();
        endif;
        // An account admin cannot active status via this endpoint
        if($authUser->id === $targetUser->id && !$isActive):
            return Response::deny('You cannot deactivate yourself');
        endif;

        return Response::allow();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $authUser, User $targetUser): bool|Response
    {
        if($authUser->id === $targetUser->id):
            return Response::deny('You cannot delete your own account.');
        endif;
        if($targetUser->roles->contains('name', 'SUPER_ADMIN')):
            return Response::deny('The primary owner cannot be deleted.');
        endif;
        return Response::allow();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
