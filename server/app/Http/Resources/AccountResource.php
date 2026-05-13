<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Models\{RefreshToken, Roles};

class AccountResource extends UserResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userData = parent::toArray($request);
        $allTokens = RefreshToken::where('users_id', $this->id)
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        // Transform the collection using the Resource
        $sessions = SessionResource::collection($allTokens)->resolve();

        // Use Laravel Collections to partition the data
        $partitioned = collect($sessions)->partition(function ($session) {
            return $session['is_active'] === true;
        });

        $active = $partitioned[0];
        $history = $partitioned[1];

        // Ensure current session is at the top of the active list
        $active = $active->sortByDesc('is_current')->values();
        $history = $history->values();

        return array_merge($userData, [
            'sessions' => [
                'active' => $active,
                'history' => $history
            ]
        ]);
    }
}
