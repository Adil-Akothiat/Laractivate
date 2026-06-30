<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\{ForgotPasswordRequest, ResetPasswordRequest};
use App\Services\Security\PasswordService;
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Facades\Support\DB;
use App\Http\Resources\System\BaseResource;

class PasswordController extends Controller
{
    public function __construct(
        protected PasswordService $passwordService
    ) {}
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $result = $this->passwordService->forgotPassword($request->validated());
        return (new BaseResource($result))->response()->setStatusCode(200);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $result = $this->passwordService->resetPassword($request->validated());
        return (new BaseResource($result))->response()->setStatusCode(200);
    }

    public function validateToken(Request $request): JsonResponse
    {
        $isValid = $this->passwordService->isResetTokenValid(
            $request->query('email') ?? '',
            $request->query('token') ?? ''
        );
        if (!$isValid) {
            return (new BaseResource(['status'=>'invalid']))->withMessage('This link has expired or is invalid.')->response()->setStatusCode(402);
        }

        return (new BaseResource(['status'=> 'valid']))->response()->setStatusCode(200);
    }
}
