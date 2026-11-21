<?php

namespace App\Http\Controllers\Api\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Resources\Security\RoleCollection;
use App\Http\Resources\System\BaseResource;
use App\Models\Role;
use App\Services\Workspace\WorkspaceRoleService;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Validation\Rule;

class WorkspaceRoleController extends Controller
{
    public function __construct(
        protected WorkspaceRoleService $roleService
    ) {
        // 
    }
    public function index(Request $request): JsonResponse
    {
        $roles = $this->roleService->getRoles($request);
        return (new RoleCollection($roles))->response()->setStatusCode(200);
    }

    public function getPermissions(Request $request) : JsonResponse
    {
        $permissionsArray = $this->roleService->getPermissions();
        $permissions = $permissionsArray['permissions'];
        $grouped = $permissionsArray['groupedPermissions'];
        return (new BaseResource(['permissions'=> $permissions, 'groupedPermissions'=> $grouped]))->response()->setStatusCode(200);
    }

    public function store(Request $request) :JsonResponse
    {
        $validatedData = $request->validate([
            'name'=> 'required|string|max:30',
            'permissions'=> 'required|array|min:1',
            'permissions.*'=> [
                'string',
                'distinct',
                Rule::exists('permissions', 'id')->where('scope', 'client')
            ]
        ]);
        
        $newSavedRole = $this->roleService->store($request, $validatedData);
        return (new BaseResource(['role'=> $newSavedRole]))->withMessage('Role created successfully!')->response()->setStatusCode(200);

    }

    public function update(Request $request, Role $role) :JsonResponse
    {
        
    }
}