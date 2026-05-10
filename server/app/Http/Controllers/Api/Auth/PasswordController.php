<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\{ForgotPasswordRequest, ResetPasswordRequest};
use App\Services\Auth\PasswordService;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Facades\Support\DB;

class PasswordController extends Controller
{
    public function __construct(
        protected PasswordService $passwordService
    ) {}
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->passwordService->forgotPassword($request->validated());
        return response()->json($result, 200);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $result = $this->passwordService->resetPassword($request->validated());
        return response()->json($result,200);
    }

    public function validateToken(Request $request): JsonResponse
    {
        $isValid = $this->passwordService->isResetTokenValid(
            $request->query('email') ?? '',
            $request->query('token') ?? ''
        );
        if (!$isValid) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'This link has expired or is invalid.'
            ], 403); 
        }

        return response()->json(['status' => 'valid'], 200);
    }
}
