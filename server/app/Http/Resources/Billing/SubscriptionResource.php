<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Services\Billing\InvoiceService;


class SubscriptionResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $plans = config('billing.plans', []);
        $planSlug = $this->type ?? 'default';

        foreach ($plans as $slug => $config) {
            if (($config['price_id'] ?? null) === $this->stripe_price) {
                $planSlug = $slug;
                break;
            }
        }

        $planConfig = $plans[$planSlug] ?? null;

        $isLiveState = in_array($this->stripe_status, ['active', 'trialing', 'past_due']);
        $onGracePeriod = $this->onGracePeriod(); 

        $scheduleDetails = null;
        $nextInvoiceDetails = null; // 🚀 Holds our dynamic upcoming invoice metrics

        if ($isLiveState && !$onGracePeriod) {
            try {
                $stripeSub = $this->asStripeSubscription();
                $stripeClient = \Laravel\Cashier\Cashier::stripe();

                $invoiceService = new InvoiceService();
                $nextInvoiceDetails = $invoiceService->previewUpcomingInvoice($stripeSub);

                // 3. Extract Pending Schedule Metadata (Same as before)
                if (!empty($stripeSub->schedule)) {
                    $schedule = $stripeClient->subscriptionSchedules->retrieve($stripeSub->schedule);
                    $nextPhase = collect($schedule->phases)->last();
                    $nextPriceId = $nextPhase->items[0]->price ?? null;
                    
                    if ($nextPriceId && $nextPriceId !== $this->stripe_price) {
                        $futurePlanSlug = 'unknown';
                        $futurePlanName = 'Next Plan';

                        foreach ($plans as $slug => $config) {
                            if (($config['price_id'] ?? null) === $nextPriceId) {
                                $futurePlanSlug = $slug;
                                $futurePlanName = $config['name'] ?? ucfirst($slug);
                                break;
                            }
                        }

                        $scheduleDetails = [
                            'id'             => $stripeSub->schedule,
                            'plan_name'      => $futurePlanName,
                            'plan_slug'      => $futurePlanSlug,
                            'transitions_at' => Carbon::createFromTimestamp($nextPhase->start_date)->toIso8601String(),
                        ];
                    }
                }

            } catch (\Exception $e) {
                Log::error("Failed to compile live Stripe dataset parameters: " . $e->getMessage());
            }
        }

        return [
            'id'                => $this->id,
            'subscribed'        => $isLiveState,
            'status'            => $this->stripe_status,
            'plan'              => [
                'name'     => $planConfig['name'] ?? ucfirst($planSlug),
                'slug'     => $planSlug,
                'price'    => $planConfig['price'] ?? 0,
                'currency' => $planConfig['currency'] ?? 'usd',
                'interval' => $planConfig['interval'] ?? 'month',
            ],
            'ends_at'           => $this->ends_at ? $this->ends_at->toIso8601String() : null,
            'on_grace_period'   => $onGracePeriod,
            'pending_downgrade' => $scheduleDetails,
            
            // 🚀 The new resource keys exposed to the client application
            'next_invoice'      => $nextInvoiceDetails, 
            
            'created_at'        => $this->created_at ? $this->created_at->toIso8601String() : null,
            'can_cancel'        => $this->active() && !$onGracePeriod && is_null($scheduleDetails),
            'can_resume'        => $onGracePeriod,
        ];
    }
}