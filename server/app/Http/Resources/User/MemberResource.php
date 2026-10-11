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
        return [
            'id'         => $this->id,
            'name' => trim("{$this->first_name} {$this->last_name}"),
            'email'      => $this->email,
            'avatar' => $this->avatar,
            'membership' => (bool) $this->is_owner,
            'role'       => $this->roles->first()?->name,
            // 'status' => 
            'joined_at'  => $this->pivot->created_at?->toIso8601String(),
        ];
    }
}
