<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\Jwt\JwtService;
// use Illuminate\Support\Facades\Log;

class SessionResource extends JsonResource
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
        // Log::info('TOKEN1', ["1"=> $request->cookie('refresh_token')]);
        // Log::info('TOKEN2', ["2"=> $this->token_hash]);
        // Log::info('TOKEN3', ["3"=> $currentTokenHash]);
        return [
            ...($this->metadata ?? []),
            'session_id'  => $this->id,
            'is_current'  => $this->token_hash === $currentTokenHash,
            'is_active'   => !$this->revoked && $this->expires_at->isFuture(),
            'revoked'     => $this->revoked,
            'last_active' => $this->updated_at->diffForHumans(),
            'users_id' => $this->users_id
        ];
    }
}
