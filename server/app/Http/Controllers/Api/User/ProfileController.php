<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Services\User\UserService;
use App\Services\System\SessionService;
use App\Services\Jwt\JwtService;

class ProfileController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected SessionService $sessionService,
        protected JwtService $jwtService,
    ) {}
    public function show(Request $request)
    {
        return response()->json(new UserResource($request->user()), 200);
    }

    public function update(StoreUserRequest $request)
    {
        $user = $request->user();
        $crendentials = $request->validated();
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

    public function deactivate(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        $this->userService->deactivate(
            $request->user(),
            $request->password
        );

        return response()->json(['message' => 'Account deactivated successfully.'], 200);
    }

    public function destroy(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        $this->userService->delete(
            $request->user(),
            $request->password
        );
        return response()->json(['message' => 'Account deleted permanently.'], 200);
    }

    // sessions management
    public function getSessions(Request $request)
    {
        $user = $request->user();
        $sessions = $this->sessionService->getSessions($user);

        return response()->json([
            'active'  => $sessions['active'] ?? [],
            'history' => $sessions['history'] ?? [],
        ]);
    }

    public function revokeSession(Request $request, string $id)
    {
        $user = $request->user();
        $this->sessionService->revokeSession($user, $id);
        return response()->json(['message' => 'Session revoked successfully.']);
    }

    public function revokeAllSessions(Request $request)
    {
        
        $currentTokenHash = hash('sha256', $request->cookie($this->jwtService->refresh_token_key));
        $user = $request->user();
        $this->sessionService->revokeAllExceptCurrent($user, $currentTokenHash);

        return response()->json(['message' => 'Other sessions revoked successfully!']);
    }

    public function clearHistory(Request $request)
    {
        $user = $request->user();
        $this->sessionService->clearHistory($user);

        return response()->json(['message' => 'History cleared successfully!']);
    }
}
