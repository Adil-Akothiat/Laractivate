<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use App\Http\Resources\Security\RoleResource;
use App\Http\Resources\System\BaseResource;

class UserResource extends BaseResource
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
            'two_factor_recovery_codes' => $this->getRecoveryCodes(),
            'two_factor_secret' => $this->two_factor_secret,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'rolesSet' => $this->roles->pluck('name'),
            'owner' => $this->id === auth()->user()->id,
            'permissions' => $this->roles->flatMap(function($role) {
                return $role->permissions;
            })->unique('id')->values(),
            'permissionsSet'=> $this->roles->flatMap(function($role) {
                return $role->permissions->pluck('name');
            })->unique('id')->values()
        ];
    }
    protected function getRecoveryCodes(): ?array
    {
        if (!$this->two_factor_recovery_codes) {
            return null;
        }

        try {
            return json_decode(decrypt($this->two_factor_recovery_codes), true);
        } catch (\Exception $e) {
            // Return null if decryption fails (e.g., after an APP_KEY change)
            return null;
        }
    }
}
