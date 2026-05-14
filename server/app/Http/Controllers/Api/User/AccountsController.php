<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{User, Role};
use App\Http\Resources\User\{UserCollection, UserResource};
use App\Services\User\UserService;
use App\Services\Security\JwtService;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Validation\Rules\Password;
use App\Services\System\SessionService;

class AccountsController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected JwtService $jwtService,
        protected SessionService $sessionService,
    ){}
    public function index(Request $request)
    {
        $users = User::latest()
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

        $users->load('roles.permissions');
        return new UserCollection($users);
    }
    public function store(StoreUserRequest $request)
    {
        $credentials = $request->validated();
        $user = $this->userService->createAccount($credentials);

        return (new UserResource($user->load('roles')))->withMessage('Account created successfully.');
    }
    public function show(User $user)
    {
        $user->load('roles.permissions');
        return new UserResource($user);
    }

    public function update(StoreUserRequest $request, User $user)
    {
        $credentials = $request->validated();
        $updatedUser = $this->userService->updateAccount($user, $credentials, auth()->user());

        return (new UserResource($updatedUser))->withMessage('Account updated successfully.');
    }
    
    public function updateAvatar(Request $request, User $user)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:2048'],
        ]);
        $avatarUrl = $this->userService->uploadAvatar(
            $user,
            $request->file('avatar')
        );
        return response()->json([
            'message'    => 'Avatar updated successfully.',
            'avatar_url' => $avatarUrl,
        ], 200);
    }

    public function changePassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);
        $this->userService->changePassword(
            $user,
            $validated['current_password'],
            $validated['password']
        );
        // Invalidate all existing tokens
        $this->jwtService->invalidateUserTokens($user->id);

        return response()->json([
            'message' => 'Account password changed successfully! Please ask the user to log in again with their new password.',
        ], 200);
    }

    public function disableTwoFactor(User $user) {
        $validated = request()->validate([
            'password' => 'required|string',
        ]);
        $this->userService->disableTwoFactor($user, $validated['password']);
        return response()->json(['message' => 'Two-factor authentication disabled for this account.'], 200);
    }

    public function destroy(User $user)
    {
        $this->userService->deleteAccount($user, auth()->user());
        return response()->json(['message' => 'User deleted successfully'], 200);
    }

    // sessions management for admin
    public function getSessions(Request $request, User $user) 
    {
        $sessions = $this->sessionService->getSessions($user);
        return new SessionCollection($sessions);
    }

    public function revokeSession(Request $request, User $user, string $sessionId)
    {
        $this->sessionService->revokeSession($user, $sessionId);
        return response()->json(['message' => 'Session revoked successfully.']);
    }

    public function revokeAllSessions(Request $request, User $user)
    {
        $currentTokenHash = hash('sha256', $request->cookie($this->jwtService->refresh_token_key));
        $this->sessionService->revokeAllExceptCurrent($user, $currentTokenHash);

        return response()->json(['message' => 'Other sessions revoked successfully!']);
    }

    public function clearHistory(Request $request, User $user)
    {
        $this->sessionService->clearHistory($user);
        return response()->json(['message' => 'History cleared successfully!']);
    }
}