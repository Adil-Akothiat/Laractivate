<?php

namespace App\Http\Controllers\Api\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseCollection;
use App\Http\Resources\System\BasePaginatedCollection;
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
        $clientId = (int) $request->attributes->get('current_client_id');

        $roles = $this->roleService->getRoles(
            $clientId,
            [
                'all' => $request->boolean('all'),
                'search' => $request->string('search')->toString(),
                'sort' => $request->string('sort')->toString(),
                'order' => $request->string('order')->toString(),
            ],
            10
        );

        $roles->withQueryString();
        return (new BaseCollection($roles))
            ->response()
            ->setStatusCode(200);
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
        $clientId = $request->attributes->get('current_client_id');
        $newSavedRole = $this->roleService->store($validatedData, $clientId);
        return (new BaseResource([]))->withMessage('Role created successfully!')->response()->setStatusCode(201);

    }

    public function update(Request $request, Role $role) :JsonResponse
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
        
        $this->roleService->updateRole($role, $validatedData);
        return (new BaseResource([]))->withMessage('Role updated successfully!')->response()->setStatusCode(201);
    }

    public function destroy(Request $request, Role $role): JsonResponse
    {
        $clientId = $request->attributes->get('current_client_id');
        $this->roleService->deleteRole($role, $clientId);
        return (new BaseResource([]))->withMessage('Role deleted successfully!')->response()->setStatusCode(201);
    }
}