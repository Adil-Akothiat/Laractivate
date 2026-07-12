<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Services\Security\RegistrationService;
use App\Services\System\SessionService;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\RegisterRequest;


class RegisterController extends Controller
{
    public function __construct(
        protected RegistrationService $registerService,
        protected AuthController $auth,
        protected SessionService $sessionService
    ) {}

    public function store(RegisterRequest $request): JsonResponse
    {
        $metadata = $this->sessionService->buildMetadata(
            $request->header('User-Agent'),
            $request->ip(),
            $request->header('Sec-CH-UA', '')
        );
        $result = $this->registerService->register($request->validated(), $metadata);
        return $this->auth->respondWithToken(
            $result['access_token'],
            $result['refresh_token'],
            $result['user']
        );
    }
}
