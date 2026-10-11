<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\System\BaseResource;
use App\Models\ClientInvitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}