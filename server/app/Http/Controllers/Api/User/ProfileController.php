<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\User\UserResource;
use App\Http\Resources\Security\SessionCollection;
use App\Http\Resources\Billing\{InvoiceCollection, SubscriptionResource};
use App\Http\Resources\System\BaseResource;
use App\Services\User\UserService;
use App\Services\Billing\{InvoiceService, SubscriptionService};
use App\Services\System\SessionService;
use App\Services\Security\JwtService;

class ProfileController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected SessionService $sessionService,
        protected JwtService $jwtService,
        protected InvoiceService $invoiceService,
        protected SubscriptionService $subscriptionService
    ) {}
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
        $sessions = $this->sessionService->getSessions($request->user());
        return new SessionCollection($sessions);
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

    // billing
    public function invoicesHistory(Request $request)
    {
        $user = auth()->user();

        // $request->query() safely captures all URL strings (?page=2&status=paid&query=inv_123) as an array
        $filters = $request->query();

        $invoices = $this->invoiceService->getUserInvoices($user, $filters);

        return new InvoiceCollection($invoices);
    }
}
