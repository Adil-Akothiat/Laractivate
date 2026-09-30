<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use App\Models\Client;
use App\Models\ClientInvitation;
use App\Notifications\GeneralAppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WorkspaceInvitationController extends Controller
{
      public function showInvitation(string $token): JsonResponse
    {
        $invitation = ClientInvitation::with(['client:id,name', 'role:id,name', 'inviter:id,first_name,last_name'])
            ->where('token', $token);

        if(!$invitation || $invitation->accepted_at || $invitation->isExpired()):
            return (new BaseResource([]))
                ->withMessage('This invitation link is invalid or has expired.')
                ->response()->setStatusCode(404);
        endif;

    }

    public function accept(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token'=> ['required', 'string']
        ]);
        $invitation = ClientInvitation::where('token', $validated['token'])->first();
        
        if (!$invitation || $invitation->accepted_at || $invitation->isExpired()) {
            return (new BaseResource([]))
                ->withMessage('This invitation is invalid or has expired.')
                ->response()->setStatusCode(400);
        }

        $user = $request->user();
        if($user->email !== $invitation->email):
            return (new BaseResource([]))
                ->withMessage('This invitation belongs to another email address.')
                ->response()->setStatusCode(403);
        endif;

        DB::transaction(function () use ($user, $invitation) {
            $user->clients()->syncWithoutDetaching([
                $invitation->client_id => ['role'=> 'member']
            ]);

            $user->roles()->syncWithoutDetaching([$invitation->role_id]);

            $invitation->update(['accepted_at'=> now()]);
        });

        return (new BaseResource([
            'client_id' => $invitation->client_id
        ]))->withMessage('You have successfully joined the workspace.')
          ->response()->setStatusCode(200);
    }


    // send invitation to a member
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validated([
            'email'=> ['required', 'email'],
            'role_id'=> ['required', 'exists:roles,id']
        ]);

        $currentClientId = $request->attributes->get('current_client_id');
        $client = Client::findOrFail($currentClientId);
        $user = $request->user();

        $exitingMember = $client->user()->where('email', $validated['email'])->exists();
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
}
