<?php

namespace App\Services\Workspace;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class WorkspaceMemberService
{
    public function getMembers(
        User $user,
        int $clientId,
        array $filters,
        int $perPage = 10
    ): LengthAwarePaginator
    {
        $client = $user->getActiveClient($clientId);
        return $client->users()
            ->selectRaw('users.id = ? as is_owner', [$client->owner_id])
            ->when(
                $filters['role_id'] ?? null,
                fn ($q, $roleId) => $q->wherePivot('role_id', $roleId)
            )
            ->when($filters['search'], function($q, $search){
                $q->where(function ($q) use($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->with([
                'clientRoles'=> fn($q)=> $q->wherePivot('client_id', $clientId)
            ])
            ->paginate($perPage)
            ->withQueryString();
        ;
    }
}