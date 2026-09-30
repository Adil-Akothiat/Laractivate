<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the primary assigned role (Single Role Approach)
        $primaryRole = $this->roles->first();

        return [
            'id'         => $this->id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'email'      => $this->email,
            'is_active'  => $this->is_active,
            'membership' => $this->pivot->role ?? 'member',
            'role'       => $primaryRole ? [
                'id'          => $primaryRole->id,
                'name'        => $primaryRole->name,
                'permissions' => $primaryRole->permissions->pluck('name'),
            ] : null,
            'joined_at'  => $this->pivot->created_at?->toIso8601String(),
        ];
    }
}
