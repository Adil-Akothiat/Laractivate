<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\{ PermissionMiddleware, JwtFromCookie, TokenRevocationMiddleware };
use Illuminate\Auth\AuthenticationException;
use App\Exceptions\ApiExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'permission' => PermissionMiddleware::class,
            'jwtFromCookie' => JwtFromCookie::class,
            'check.revocation' => TokenRevocationMiddleware::class,
        ]);
        $middleware->encryptCookies(
            except:['refresh_token', 'access_token']
        );
        $middleware->prependToGroup('api', 'jwtFromCookie');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 1. Handle Validation Errors (from Service/Request)
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiExceptionHandler::handleValidationException($e);
            }
        });

        // 2. Handle Auth Errors
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiExceptionHandler::handleAuthenticationException($e, $request);   
            }
        });

        // 3. Handle Throttling
        $exceptions->render(function (ThrottleRequestsException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiExceptionHandler::handleThrottleException($e, $request);
            }
        });

        // 4. (Recommended) Generic Catch-all for API 500s
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'code' => 'SERVER_ERROR',
                    'message' => config('app.debug') ? $e->getMessage() : 'An unexpected error occurred.'
                ], 500);
            }
        });
    })->create();