<?php

namespace App\Services\Billing;

use App\Models\User;
use Stripe\Event;

class PlanService
{
    private $plans;
    public function __construct() {
        $this->plans = config('billing.plans');
    }
    
    public function getPlan(string $slug): Array
    {
        $plans = config('billing.plans');
        $targetPlan = collect($plans)->firstWhere('slug', $slug);
        return $targetPlan;
    }
}