<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use App\Services\Security\JwtService;
use App\Http\Resources\System\BaseResource;

class SessionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $jwtService = new JwtService();
        $currentTokenHash = hash('sha256', $request->cookie($jwtService->refresh_token_key));
        return [
            ...($this->metadata ?? []),
            'session_id'  => $this->id,
            'is_current'  => $this->token_hash === $currentTokenHash,
            'is_active'   => !$this->revoked && $this->expires_at->isFuture(),
            'revoked'     => $this->revoked,
            'last_active' => $this->updated_at->diffForHumans(),
            'user_id' => $this->user_id
        ];
    }
}
