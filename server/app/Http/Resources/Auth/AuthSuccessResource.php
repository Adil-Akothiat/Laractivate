<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

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
        Log::info('user info', [
            'id' => $this->last
        ]);

        return [
            'redirect_path'=> "/workspaces/$slug"
        ];
    }
}
