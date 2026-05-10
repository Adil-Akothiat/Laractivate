<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Observers\UserObserver;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\{ Login, Logout, PasswordReset };
use App\Listeners\{ LogSuccessfulLogin, LogSuccessfulLogout, LogResetPassword };


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register 
     * User::observe(UserObserver::class);any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Schema::defaultMorphKeyType('uuid');
        // The Magic Line:
        Schema::blueprintResolver(function ($table, $callback) {
            $blueprint = new Blueprint($table, $callback);
            $blueprint->engine = 'InnoDB';
            return $blueprint;
        });
        User::observe(UserObserver::class);
        Event::listen(
            Login::class,
            LogSuccessfulLogin::class
        );
        Event::listen(
            Logout::class,
            LogSuccessfulLogout::class
        );
        Event::listen(
            PasswordReset::class,
            LogResetPassword::class
        );
    }
}
