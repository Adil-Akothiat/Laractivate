<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthSuccessResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentClientId = $this->last_active_client_id;
        $slug = $currentClientId ? $this->getActiveClient($currentClientId)->slug : $this->clients()->first()->slug;
        return [
            'redirect_path'=> "/$slug/dashboard"
        ];
    }
}
