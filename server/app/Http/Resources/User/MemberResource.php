<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Log::info('user roles', ['roles'=> $this]);
        return [
            'id'         => $this->id,
            'full_name' => trim("{$this->first_name} {$this->last_name}"),
            'email'      => $this->email,
            'avatar' => $this->avatar,
            'membership' => (bool) $this->is_owner,
            'role'       => $this->role,
            // 'status' => 
            'joined_at'  => $this->pivot->created_at?->toIso8601String(),
        ];
    }
}