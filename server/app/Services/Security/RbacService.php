<?php

namespace App\Services\Security;

use App\Models\{Role, Permission, User};
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use App\Http\Resources\Security\PermissionCollection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RbacService
{
    /**
     * List roles with filtering and user counts.
    */
    public function rolesList(array $filters): LengthAwarePaginator
    {
        return Role::withCount('users')
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($filters['group'] ?? null, function ($q, $group) {
                $q->whereHas('permissions', fn($q) => $q->where('group', $group));
            })
            ->when($filters['permission'] ?? null, function ($q, $permission) {
                $q->whereHas('permissions', fn($q) => $q->where('id', $permission));
            })
            ->orderByRaw("name = 'Super Admin' DESC")
            ->orderBy('created_at', 'desc')
            ->paginate(3)
            ->withQueryString();
    }

    /**
     * Create a new role and attach permissions.
     */
    public function createRole(array $data): Role
    {
        return DB::transaction(function () use ($data) {
            $role = Role::create([
                'id' => (string) Str::uuid(),
                'name' => $data['name'],
                'is_locked' => false
            ]);

            if (!empty($data['permissions'])) {
                $role->permissions()->sync($data['permissions']);
            }

            return $role;
        });
    }

    /**
     * Update an existing role.
     */
    public function updateRole(string $id, array $data): Role
    {
        $role = Role::findOrFail($id);

        // Rule: Protect System Roles
        if ($role->is_locked && $data['name'] !== $role->name) {
            throw new \Exception('System role names cannot be changed.', 403);
        }

        return DB::transaction(function () use ($role, $data) {
            $role->name = $data['name'];
            $role->save();

            $role->permissions()->sync($data['permissions'] ?? []);
            return $role;
        });
    }

    /**
     * Delete a role if it's not locked or in use.
     */
    public function deleteRole(string $id): void
    {
        $role = Role::findOrFail($id);

        if ($role->is_locked) {
            throw new \Exception('System roles are protected.', 403);
        }

        if ($role->users()->exists()) {
            throw new \Exception('Cannot delete role assigned to active users.', 422);
        }

        $role->delete();
    }

    public function getRole(string $id): Role
    {
        $role = Role::findOrFail($id);
        return $role;
    }
}