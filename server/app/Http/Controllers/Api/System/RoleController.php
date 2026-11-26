<?php

namespace App\Http\Controllers\Api\System;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Http\Resources\Security\{PermissionCollection};
use App\Http\Resources\System\BasePaginatedCollection;
use App\Http\Resources\System\BaseResource;
use App\Models\{Role, Permission, User};
use App\Services\System\SystemRoleService;
use Illuminate\Http\{Request, JsonResponse};

class RoleController extends Controller
{
    public function __construct(
        protected SystemRoleService $systemRole
    ) {}

    public function index(Request $request): JsonResponse
    {
        if($request->has('all') && !$request->has('scope')):
            $roles = Role::all();
            $roles->load('permissions');
            return (new BaseResource($roles))->response();
        endif;
        if($request->has('scope')):

        endif;
        $roles = $this->systemRole->rolesList($request->all());
        $roles->load('permissions');
        return (new BasePaginatedCollection($roles))
            ->response()
            ->setStatusCode(200);
    }

    public function store(RoleRequest $request): JsonResponse
    {
        $role = $this->systemRole->createRole($request->validated());
        return (new BaseResource($role))->withMessage('Role created successfully.')->response()->setStatusCode(201);
    }

    public function update(RoleRequest $request, string $id): JsonResponse
    {

        $role = $this->systemRole->updateRole($id, $request->validated());
        return (new BaseResource($role))->withMessage('Role updated successfully.')->response()->setStatusCode(200);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->systemRole->deleteRole($id);
        return response()->json(['message'=> 'Role deleted successfully.'], 204);
    }

    // Keep show() and getPermissions() simple
    public function show(string $id): JsonResponse
    {
        $role = $this->systemRole->getRole($id);
        $role->load('permissions');
        return (new BaseResource($role))->response()->setStatusCode(200);
    }

    public function getPermissions(): JsonResponse
    {
        $permissions = Permission::all();
        return (new PermissionCollection($permissions))->response()->setStatusCode(200);
    }

    // rbac unassigned role
    public function assignRole(User $user, Role $role) {
        $user->roles()->attach($role->id);
        return response()->json(['message'=> 'Role assigned successfully.'], 200);
    }
    
    public function unassignRole(User $user, Role $role) {
        $role->loadCount('users');
        $this->authorize('detach', [$role, $user]);
        $user->roles()->detach($role->id);
        return response()->json(['message'=> 'Role unassigned successfully.'], 204);
    }
}