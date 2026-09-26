<?php

namespace App\Providers;

use App\Models\{User, Subscription, SubscriptionItem};
use App\Observers\UserObserver;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register 
     * User::observe(UserObserver::class);any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Schema::defaultMorphKeyType('uuid');
        Cashier::useSubscriptionModel(Subscription::class);
        Cashier::useSubscriptionItemModel(SubscriptionItem::class);
        // The Magic Line:
        Schema::blueprintResolver(function ($table, $callback) {
            $blueprint = new Blueprint($table, $callback);
            $blueprint->engine = 'InnoDB';
            return $blueprint;
        });
        User::observe(UserObserver::class);
    }
}
