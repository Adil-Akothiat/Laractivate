<?php

namespace App\Http\Controllers\Api\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BasePaginatedCollection;
use App\Http\Resources\System\BaseResource;
use App\Http\Resources\User\MemberResource;
use App\Models\Client;
use App\Models\ClientInvitation;
use App\Notifications\GeneralAppNotification;
use App\Services\Workspace\WorkspaceMemberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class MembersController extends Controller
{
    public function __construct(
        protected WorkspaceMemberService $memberService
    ) {
        // 
    }
    public function index(Request $request)
    {
        $user = $request->user();
        $clientId = $request->attributes->get('current_client_id');

        if (!$clientId) {
            return (new BaseResource([]))
                ->withMessage('No active workspace selected.')
                ->response()->setStatusCode(400);
        }

        $members = $this->memberService->getMembers($user, $clientId, [
            'search' => $request->string('search')->toString(),
            'role_id' => $request->get('role_id')
        ], 10);

        return (new BasePaginatedCollection($members, MemberResource::class))->response()->setStatusCode(200);
    }


    // Send invitation to a member
    public function invite(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'=> ['required', 'email', 'exists:users,email'],
            'role_id'=> ['required', 'exists:roles,id']
        ]);

        $currentClientId = $request->attributes->get('current_client_id');
        $client = Client::findOrFail($currentClientId);
        $user = $request->user();

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
        $acceptUrl = config('app.frontend_url') . '/invitations/process?token=' . $invitation->token;

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