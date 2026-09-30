<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use App\Http\Resources\User\MemberCollection;
use App\Models\Client;
use Illuminate\Http\Request;

class WorkspaceMemberController extends Controller
{
    public function index(Request $request)
    {
        $currentClientId = $request->attributes->get('current_client_id');

        if (!$currentClientId) {
            return (new BaseResource([]))
                ->withMessage('No active workspace selected.')
                ->response()->setStatusCode(400);
        }

        $client = Client::findOrFail($currentClientId);
        // Scope users strictly to the active workspace
        $members = $client->users()
            ->latest('client_user.created_at')
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name',  'like', "%{$search}%")
                      ->orWhere('email',      'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($q, $role) {
                $q->whereHas('roles', fn($q) => $q->where('name', $role));
            })
            ->when($request->status, function ($q, $status) {
                $q->where('is_active', $status === 'active');
            })
            ->paginate(10)
            ->withQueryString();

        // Eager load relations for performance
        $members->load(['roles.permissions']);

        return new MemberCollection($members);
    }
}
