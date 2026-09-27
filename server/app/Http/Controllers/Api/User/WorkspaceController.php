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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    public function index(Request $request) {
        $userWorkspaces = $request->user()
        ->clients()
        ->select('clients.id', 'name', 'slug')
        ->get();
        $currentClientId = $request->attributes->get('current_client_id');
        
        return (new BaseResource([
            'workspaces' => $userWorkspaces,
            'current_client_id' => $currentClientId
        ]))->response()->setStatusCode(200);
    }

    public function switchWorkspace(Request $request): JsonResponse
    {
            $validated = $request->validate([
                'client_id' => ['required', 'integer', 'exists:clients,id'],
            ]);

            $user = $request->user();

            $client = $user->clients()
            ->select('clients.id', 'name', 'slug')
            ->where('clients.id', $validated['client_id'])->first();

            if (!$client) {
                return (new BaseResource(['code'=> 'UNAUTHORIZED_TENANT_ACCESS']))
                ->withMessage('You do not have access to this workspace.')
                ->response()
                ->setStatusCode(403);
            }

            session(['current_client_id'=> $client->id]);
            session()->save();
            
            return (new BaseResource([]))->withMessage('Switched active client successfully.')->response()->setStatusCode(201);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'=> ['required', 'string', 'max:100']
        ]);

        $user = $request->user();
        DB::transaction(function () use ($validated, $user) {
            $client = Client::create([
                'name'=> $validated['name'],
                'slug'=> Str::slug($validated['name']) . '-' . Str::random(5),
                'owner_id'=> $user->id
            ]);

            $user->clients()->attach($client->id, [
                'role'=> 'owner'
            ]);
        });

        return (new BaseResource([]))->withMessage('Workspace created successfully.')
            ->response()
            ->setStatusCode(201)
        ;
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
            ->response()->setStatusCode(201);turn 
    }
    
}
