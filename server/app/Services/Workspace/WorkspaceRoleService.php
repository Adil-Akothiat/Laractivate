<?php

namespace App\Services\Workspace;

use App\Http\Resources\Security\PermissionResource;
use App\Models\{Role, Permission};
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WorkspaceRoleService
{
    /**
     * List roles with filtering and user counts.
    */
    public function getRoles(Request $request): LengthAwarePaginator
    {
        $allowedQueries = ["search", "order", "sort"];
        $clientId = $request->attributes->get('current_client_id');
        $query = Role::query()
            ->where('scope', 'client')
            ->whereHas('clients', function($query) use ($clientId) {
                $query->where('clients.id', $clientId);
            })
            ->withCount(['clients as users_count']);
        $queries = $request->query();
        if(!$request->has('all')):
            foreach($queries as $key=>$value):
                switch($key) {
                    case 'search':
                        if ($request->filled('search')):
                            $query->where('name', 'like', '%' . $value . '%');
                        endif;
                        break;
                    case 'sort':
                        if($value === 'latest'):
                            $query->latest();
                        elseif ($value === 'oldest'):
                            $query->oldest();
                        endif;
                        break;
                    case 'order':
                        if(in_array($value, ['asc', 'desc'])):
                            $query->orderBy('name', $value);
                        endif;
                        break;   
                }
            endforeach;
        endif;
        $roles = $query->paginate(10)->withQueryString();
        $roles->load('permissions');
        return $roles;
    }

    /**
     * Create a new role and attach permissions.
     */
    public function store(Request $request, array $data): Role
    {
        $clientId = $request->attributes->get('current_client_id');
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