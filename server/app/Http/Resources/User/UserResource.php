<?php

namespace App\Http\Resources\User;

use App\Http\Resources\System\BaseResource;
use App\Services\System\SystemRoleService;
use Illuminate\Http\Request;

class UserResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     * @return array<string, mixed>
    */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $clientId = $request->attributes->get('current_client_id');
        if(!$clientId):
            $clientId = $user->clients()->first()?->id;
        endif;

        $rbacService = new SystemRoleService();
        $permissionsResovler = $rbacService->permissionResolver($request->user(), $clientId);

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
            'rbac' => [
                'system_roles' => $permissionsResovler['system_roles'],
                'client_role' => $permissionsResovler['client_role'],
                'permissions' => $permissionsResovler['permissions']
            ]
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