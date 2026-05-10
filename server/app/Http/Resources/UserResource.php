<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @return array<string, mixed>
    */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'two_factor_enabled' => $this->two_factor_enabled,
            'two_factor_secret' => $this->two_factor_secret,
            'roles' => $this->roles,
            'rolesSet' => $this->roles->pluck('name'),
            'owner' => $this->id === auth()->user()->id,
            'permissionsSet'=> $this->roles->flatMap(function($role) {
                return $role->permissions->pluck('name');
            }),
            'permissions' => $this->roles->flatMap(function($role) {
                return $role->permissions;
            })
        ];
    }
}
