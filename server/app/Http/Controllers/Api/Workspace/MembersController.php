<?php

namespace App\Http\Controllers\Api\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use App\Http\Resources\User\MemberCollection;
use App\Models\Client;
use App\Models\ClientInvitation;
use App\Notifications\GeneralAppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class MembersController extends Controller
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
    
        $clientInvitations = $client->clientInvitations;
        // Scope users strictly to the active workspace
        $members = $client->users()
            ->select('users.*')
            ->selectRaw('users.id = ? as is_owner', [$client->owner_id])
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

        Log::info('data', [
            'members'=> $client->users,
            'invitations' => $clientInvitations
        ]);

        return (new MemberCollection($members))->additional([
            'invitations'=> $clientInvitations
        ]);
    }


    // Send invitation to a member
    public function invite(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'=> ['required', 'email'],
            'role_id'=> ['required', 'exists:roles,id']
        ]);

        $currentClientId = $request->attributes->get('current_client_id');
        $client = Client::findOrFail($currentClientId);
        $user = $request->user();

        $exitingMember = $client->users()->where('email', $validated['email'])->exists();
        if($exitingMember):
            return (new BaseResource([]))
                ->withMessage('This user is already a member of this workspace.')->response()->setStatusCode(422);
        endif;
        $invitation = ClientInvitation::updateOrCreate(
            [
                'client_id'=> $client->id,
                'email'=> $validated['email']
            ],
            [
                'role_id'=> $validated['role_id'],
                'token'=> Str::random(40),
                'expires_at'=> now()->addDay(7),
                'invited_by'=> $user->id,
                'accepted_at'=> null
            ]
        );
        $acceptUrl = config('app.frontend_url') . '/invitations/accept?token=' . $invitation->token;

        // send notification
        Notification::route('mail', $invitation->email)
            ->notify(new GeneralAppNotification([
                'send_email' => true,
                'subject'    => 'Invitation to join ' . $client->name,
                'title'      => 'Workspace Invitation',
                'greeting'   => 'Hello!',
                'message'    => "You have been invited by {$user->first_name} to join their workspace: {$client->name}.",
                'lines'      => [
                    "You have been invited by {$user->first_name} to join their workspace: {$client->name}.",
                    "This invitation will expire in 7 days."
                ],
                'btn_text'   => 'Accept Invitation',
                'url'        => $acceptUrl,
                'footer'     => 'If you were not expecting this invitation, no further action is required.',
                'type'       => 'info',
                'icon'       => 'mail'
            ]));
        return (new BaseResource($invitation))
            ->withMessage('Invitation sent successfully.')
            ->response()->setStatusCode(201);
    }

    public function detach() {
        
    }

    public function updateRole() {
        
    }
}