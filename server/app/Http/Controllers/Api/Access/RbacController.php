<?php

namespace App\Http\Controllers\Api\Access;

use App\Http\Controllers\Controller;
use Illuminate\Http\{Request, JsonResponse};
use App\Services\Security\RbacService;
use App\Http\Requests\RoleRequest;
use App\Models\{Role, Permission};
use App\Http\Resources\Security\PermissionCollection;

class RbacController extends Controller
{
    public function __construct(
        protected RbacService $rbacService
    ) {}

    public function index(Request $request): JsonResponse
    {
        if($request->has('all')):
            return response()->json([
                'roles'=> Role::all()
            ]);
        endif;
        $roles = $this->rbacService->rolesList($request->all());
        $roles->load('permissions');

        return response()->json([
            'roles' => $roles->items(),
            'meta' => $this->paginationMeta($roles)
        ], 200);
    }

    public function store(RoleRequest $request): JsonResponse
    {
        $this->rbacService->createRole($request->validated());
        return response()->json(['message' => 'Role created successfully.'], 201);
    }

    public function update(RoleRequest $request, string $id): JsonResponse
    {
        try {
            $this->rbacService->updateRole($id, $request->validated());
            return response()->json(['message' => 'Role updated successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        // try {
        $this->rbacService->deleteRole($id);
        return response()->json(['message' => 'Role deleted successfully.']);
        // } catch (\Exception $e) {
        //     return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 400);
        // }
    }

    // Keep show() and getPermissions() simple
    public function show(string $id): JsonResponse
    {
        $role = $this->rbacService->getRole($id);
        return response()->json([
            'role' => $role,
            'attached_ids' => $role->permissions->pluck('id')
        ]);
    }

    public function getPermissions(): JsonResponse
    {
        $permissions = $this->rbacService->getPermissions();
        return response()->json($permissions, 200);
    }
}