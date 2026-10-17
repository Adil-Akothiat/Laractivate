<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Services\Auth\RegistrationService;
use App\Support\DeviceDetector;
use Illuminate\Http\JsonResponse;


class RegisterController extends Controller
{
    public function __construct(
        protected RegistrationService $registerService,
        protected AuthController $auth,
        protected DeviceDetector $deviceDetector
    ) {}

    public function store(RegisterRequest $request): JsonResponse
    {
        $metadata = $this->deviceDetector->buildMetadata(
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
