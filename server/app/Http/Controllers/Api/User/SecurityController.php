<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\Security\SessionCollection;
use App\Http\Resources\System\BaseResource;
use App\Services\Auth\{ JwtService, TwoFactorAuthService };
use App\Services\User\UserService;
use App\Services\User\UserSessionService;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Validation\Rules\Password;

class SecurityController extends Controller
{
    public function __construct(
        protected JwtService $jwtService,
        protected UserService $userService,
        protected TwoFactorAuthService $tfaService,
        protected UserSessionService $userSession
    ) {}

    public function changePassword(Request $request):JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        $this->userService->changePassword(
            $request->user(),
            $validated['current_password'],
            $validated['password']
        );

        $this->jwtService->invalidateUserTokens($request->user()->id);
        
        return response()->json([
            'message' => 'Password changed successfully! Please log in again.',
        ], 200);
    }

    public function init(): JsonResponse
    {
        $tfaQrcode = $this->tfaService->initializeSetup(auth()->user());
        return (new BaseResource(['tfaQrcode' => $tfaQrcode]))->withMessage('2FA enabled successfully.')->response()->setStatusCode(200);
    }

    public function enable(Request $request):JsonResponse
    {
        $request->validate(['otp' => 'required|string']);
        $data = $this->tfaService->verifyAndEnable(auth()->user(), $request->otp);
        return (new BaseResource($data))->withMessage('2FA enabled successfully.')->response()->setStatusCode(200);
    }

    public function disable(Request $request):JsonResponse
    {
        $request->validate(['password' => 'required|string']);

        $this->tfaService->disable(auth()->user(), $request->password);
        return (new BaseResource([]))->withMessage('2FA disabled successfully.')->response()->setStatusCode(200);
    }

    /**
     * Optional: Allow users to regenerate codes without re-enabling 2FA
     */
    public function regenerateCodes():JsonResponse
    {
        $codes = $this->tfaService->generateRecoveryCodes(auth()->user());
        return (new BaseResource(['recoveryCodes' => $codes]))->withMessage('Recovery codes generated successfully.')->response()->setStatusCode(200);
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
        $sessions = $this->userSession->getSessions($request->user());
        return new SessionCollection($sessions);
    }

    public function revokeSession(Request $request, string $id)
    {
        $user = $request->user();
        $this->userSession->revokeSession($user, $id);
        return response()->json(['message' => 'Session revoked successfully.']);
    }

    public function revokeAllSessions(Request $request)
    {

        $currentTokenHash = hash('sha256', $request->cookie($this->jwtService->refresh_token_key));
        $user = $request->user();
        $this->userSession->revokeAllExceptCurrent($user, $currentTokenHash);

        return response()->json(['message' => 'Other sessions revoked successfully!']);
    }

    public function clearHistory(Request $request)
    {
        $user = $request->user();
        $this->userSession->clearHistory($user);

        return response()->json(['message' => 'History cleared successfully!']);
    }

    // billing
    // public function invoicesHistory(Request $request)
    // {
    //     $user = auth()->user();

    //     // $request->query() safely captures all URL strings (?page=2&status=paid&query=inv_123) as an array
    //     $filters = $request->query();

    //     $invoices = $this->invoiceService->getUserInvoices($user, $filters);

    //     return new InvoiceCollection($invoices);
    // }
}