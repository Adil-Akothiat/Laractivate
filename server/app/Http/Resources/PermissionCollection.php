<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PermissionCollection extends ResourceCollection
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
            'permissions' => $permissions,
            'grouped'     => $grouped,
            'default'       => $this->collection->firstWhere('name', 'dashboard.view'),
        ];
    }
}
