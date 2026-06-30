<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;

class SubscriptionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $planSlug = $this->type ?? $this->name;
        $planConfig = config("billing.plans.{$planSlug}");

        // 🟢 Dynamic Check: Is this specific historical row currently active, trialing, or past_due?
        $isLiveState = in_array($this->stripe_status, ['active', 'trialing', 'past_due']);

        return [
            'id'              => $this->id,
            'subscribed'      => $isLiveState, // 🟢 Dynamic boolean per row! False for 'canceled'/'expired' rows.
            'status'          => $this->stripe_status,
            'plan'            => [
                'name'     => $planConfig['name'] ?? ucfirst($planSlug),
                'slug'     => $planSlug,
                'price'    => $planConfig['price'] ?? 0,
                'currency' => $planConfig['currency'] ?? 'usd',
                'interval' => $planConfig['interval'] ?? 'month',
            ],
            'renews_at'       => $this->current_period_end ? $this->current_period_end->toIso8601String() : null,
            'ends_at'         => $this->ends_at ? $this->ends_at->toIso8601String() : null,
            'on_grace_period' => !is_null($this->ends_at) && $this->ends_at->isFuture(),
            'created_at'      => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}