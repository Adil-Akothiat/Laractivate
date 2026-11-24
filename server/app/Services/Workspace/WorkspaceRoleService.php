<?php

namespace App\Services\Workspace;

use App\Http\Resources\Security\PermissionResource;
use App\Models\{Role, Permission};
// use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WorkspaceRoleService
{
    /**
     * List roles with filtering and user counts.
    */
    public function getRoles(
        int $clientId,
        array $filters = [],
        int $perPage = 10
    ): LengthAwarePaginator
    {
        $query = Role::query()
            ->where('scope', 'client')
            ->whereHas('clients', function ($query) use ($clientId) {
                $query->where('clients.id', $clientId);
            })
            ->withCount([
                'clientUsers as users_count' => function ($query) use ($clientId) {
                    $query->where('client_user.client_id', $clientId);
                },
            ]);

        if (! ($filters['all'] ?? false)) {
            if (! empty($filters['search'])) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            }

            if (($filters['sort'] ?? null) === 'latest') {
                $query->latest();
            } elseif (($filters['sort'] ?? null) === 'oldest') {
                $query->oldest();
            }

            if (in_array($filters['order'] ?? null, ['asc', 'desc'], true)) {
                $query->orderBy('name', $filters['order']);
            }
        }

        $roles = $query->paginate($perPage);
        $roles->load('permissions');

        return $roles;
    }

    /**
     * Create a new role and attach permissions.
     */
    public function store(array $data, string $clientId): Role
    {
        return DB::transaction(function () use ($clientId, $data) {
            $role = Role::create([
                'id' => (string) Str::uuid(),
                'name' => $data['name'],
                'scope' => 'client',
                'is_locked' => false
            ]);

            $role->clients()->attach($clientId);

            if (!empty($data['permissions'])) {
                $role->permissions()->sync($data['permissions']);
            }

            return $role->load('permissions');
        });
    }

    /**
     * Update an existing role.
     */
    public function updateRole(Role $role, array $data): void
    {
        DB::transaction(function () use ($data, $role) {
            Log::info(['data'=>$data]);
            $role->update([
                'name'=> $data['name']
            ]);
            if(!empty($data['permissions'])):
                $role->permissions()->sync($data['permissions']);
            endif;
        });
    }

    /**
     * Delete a role if it's not locked or in use.
     */
    public function deleteRole(Role $role, string $clientId): void
    {
         if(!$role):
            throw new BusinessRuleException(
                'Role not found!',
                404
            );
        endif;
        if($role->is_locked):
            throw new BusinessRuleException(
                'You cannot delete the locked role',
                422
            );
        endif;
        
        // check if this role is assigned to a member
        $membersCount = $role->clientUsers()->wherePivot('client_id', $clientId)->count();
        if($membersCount>0):
            throw new BusinessRuleException(
                "This role is assigned to $membersCount members you cannot delete it!",
                422
            );
        endif;
        $role->delete();
    }
    
    public function getPermissions(): array
    {
        $permissions = Permission::query()
            ->where('scope', "client")
            ->orderBy('group')
            ->orderBy('name')
            ->get();
        $grouped =  $permissions
            ->groupBy(fn (Permission $permission) => $permission->group ?: 'Other')
            ->map(fn ($items, string $group) => [
                'group' => $group,
                'permissions' => PermissionResource::collection($items),
            ])
            ->values();
        return [
            'permissions'=> $permissions,
            'groupedPermissions'=> $grouped,
        ];
    }
}