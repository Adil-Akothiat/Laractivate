<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Services\User\{UserService};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        protected UserService $userService,
        // protected UserSessionService $userSession,
        // protected JwtService $jwtService,
        // protected InvoiceService $invoiceService,
        // protected SubscriptionService $subscriptionService
    ) {}

     public function me(Request $request): JsonResponse
    {
        // $clientId = $request->attributes->get('current_client_id');
        // if($clientId):
        //     $activeClient = $user->clients()->first();
        //     $clientId = $activeClient?->id;
        // endif;
        // $this->systemRole->permissionResolver($request->user());
        return (new UserResource($request->user()))->response()->setStatusCode(200);
    }
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }

    public function update(Request $request)
    {
        $crendentials = $request->validate([
            'first_name' => 'required|string|max:32',
            'last_name'  => 'required|string|max:32',
            'email'      => 'sometimes|email|max:191|unique:users,email'
        ]);

        $user = $request->user();
        $user->update($crendentials);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ], 200);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:2048'],
        ]);
        $avatarUrl = $this->userService->uploadAvatar(
            $request->user(),
            $request->file('avatar')
        );
        return response()->json([
            'message'    => 'Avatar updated successfully.',
            'avatar_url' => $avatarUrl,
        ], 200);
    }
}
