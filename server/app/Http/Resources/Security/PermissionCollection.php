<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class PermissionCollection extends BasePaginatedCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $grouped = $this->collection
            ->groupBy('group')
            ->map(fn($perms) => PermissionResource::collection($perms))
            ->toArray();
        
        $permissions = PermissionResource::collection($this->collection);
        return [
            'data'=> [
                'permissions' => $permissions,
                'grouped'     => $grouped,
                'default'       => $this->collection->firstWhere('name', 'dashboard.view'),
            ]
        ];
    }
}
