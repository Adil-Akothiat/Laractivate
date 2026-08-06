<?php

namespace App\Services\Billing;

use App\Models\{User, PaymentMethod, TaxRate, Invoice, Subscription};
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Laravel\Cashier\Cashier;
use Exception;


class InvoiceService
{
    /**
     * Synchronize invoice transaction data rows for dashboard ledger tables.
    */

    protected $stripe;
    public function __construct() {
        $this->stripe = Cashier::stripe();
    }

    public function handleInvoicePaymentSucceeded(object $invoiceData): bool
    {
        // 1. 🟢 Extract ALL required properties safely from the Stripe object
        $stripeInvoiceId = $invoiceData->id;
        $stripeCustomerId = $invoiceData->customer;
        $stripePaymentMethodId = $invoiceData->payment_method ?? null;
        
        // Locate the local user via their Stripe Customer ID
        $user = User::where('stripe_id', $stripeCustomerId)->first();
        Log::info("1🧾 [InvoiceService] INVOICESDATA", ['invoices' => $invoiceData]);
        
        // Safely extract subscription ID from Stripe's nested object structure
        $stripeSubscriptionId = $invoiceData->subscription 
            ?? $invoiceData->parent->subscription_details->subscription 
            ?? null;

        if (!$user && !empty($stripeSubscriptionId)) {
            $localSubscription = Subscription::where('stripe_id', $stripeSubscriptionId)->first();
            
            Log::info("2🧾 [InvoiceService] SUBS", ['lsb' => $localSubscription]);
            if ($localSubscription) {
                $user = $localSubscription->user;
                
                Log::info("3🧾 [InvoiceService] USER", ['user' => $user]);
                if ($user) {
                    $user->update(['stripe_id' => $stripeCustomerId]);
                }
            }
        }
        
        // FIX: Use optional() or null coalescing so it never throws a fatal error if $user is null
        Log::info('INVOICES USER EXISTS', ['user_id' => $user->id ?? 'NOT FOUND']);
        
        if (!$user) {
            Log::warning("⚠️ Invoice processing skipped: No local user found matching Customer ID {$stripeCustomerId} or Subscription ID {$stripeSubscriptionId}");
            return false;
        }

        // 2. Map Stripe Payment Method Token to local integer ID
        $localPaymentMethodId = null;
        if ($stripePaymentMethodId) {
            $paymentMethod = PaymentMethod::updateOrCreate(
                ['stripe_payment_method_id' => $stripePaymentMethodId],
                [
                    'user_id' => $user->id,
                ]
            );
            $localPaymentMethodId = $paymentMethod->id;
        }

        // 3. Map the first Stripe Tax Rate Token to local integer ID
        $localTaxRateId = null;
        if (!empty($invoiceData->default_tax_rates)) {
            $stripeTaxRateId = $invoiceData->default_tax_rates[0];
            
            $taxRate = TaxRate::updateOrCreate(
                ['stripe_tax_rate_id' => $stripeTaxRateId],
                [
                    'name'       => 'VAT / Tax Rate', 
                    'percentage' => $invoiceData->tax_percent ?? 0
                ]
            );
            $localTaxRateId = $taxRate->id;
        }

        // 4. Create or Update the historical transaction record
        Invoice::updateOrCreate(
            ['stripe_invoice_id' => $stripeInvoiceId],
            [
                'user_id'            => $user->id,
                'subtotal'           => $invoiceData->subtotal,
                'tax_amount'         => $invoiceData->tax ?? 0,
                'total'              => $invoiceData->total,
                'currency'           => strtoupper($invoiceData->currency),
                'status'             => $invoiceData->status,
                'payment_method_id'  => $localPaymentMethodId,
                'tax_rate_id'        => $localTaxRateId,
                'hosted_invoice_url' => $invoiceData->hosted_invoice_url,
                'invoice_pdf'        => $invoiceData->invoice_pdf,
            ]
        );

        Log::info("💵 Invoice successfully recorded locally for User ID {$user->id}. Invoice ID: {$stripeInvoiceId}");
        return true;
    }

    public function getUserInvoices(User $user, array $filters = [])
    {
        // Extract common query params with default fallbacks
        $perPage = $filters['per_page'] ?? 10;
        $orderBy = $filters['order_by'] ?? 'created_at';
        $sort    = $filters['sort'] ?? 'desc';

        return Invoice::where('user_id', $user->id)
            // 🔍 Filter 1: Optional search query (matches against invoice numbers or metadata)
            ->when(!empty($filters['query']), function ($query) use ($filters) {
                $query->where(function ($subQuery) use ($filters) {
                    $subQuery->where('id', 'LIKE', "%{$filters['query']}%")
                            ->orWhere('stripe_id', 'LIKE', "%{$filters['query']}%")
                            ->orWhere('status', 'LIKE', "%{$filters['query']}%");
                });
            })
            // 🏷️ Filter 2: Direct match for payment statuses (e.g., 'paid', 'open', 'void')
            ->when(!empty($filters['status']), function ($query) use ($filters) {
                $query->where('status', $filters['status']);
            })
            // 📊 Sorting Layer
            ->orderBy($orderBy, $sort)
            // 🟢 Paginate auto-handles the 'page' parameter passed by the client
            ->paginate($perPage)
            // This appends the dynamic parameters to the generated pagination links layout
            ->appends($filters);
    }

    public function previewUpcomingInvoice(object $stripeSubscription, bool $withProration = false, string $newPriceId = null): array|object
    {
        try {
            $params = [
                'customer' => $stripeSubscription->customer,
            ];
            
            if(!empty($stripeSubscription->schedule)) {
                $params['schedule'] = $stripeSubscription->schedule;
            } else {
                $params['subscription'] = $stripeSubscription->id;
            }
            if($withProration) {
                $params['subscription_details'] = [
                    'proration_behavior' => 'always_invoice',
                    'items' => [
                        [
                            'id' => $stripeSubscription->items->data[0]->id,
                            'price' => $newPriceId ?? $stripeSubscription->items->data[0]->price->id,
                        ],
                    ],
                ];
            }
            $invoice = $this->stripe->invoices->createPreview($params);
            if ($invoice) {
                return $withProration ? $invoice :
                [
                    'amount'     => $invoice->amount_due / 100,
                    'currency'   => strtoupper($invoice->currency),
                    'billing_at' => Carbon::createFromTimestamp($invoice->next_payment_attempt)->toIso8601String(),
                ];
            }
            return [];
        } catch (\Exception $e) {
            throw new \Exception('Failed to preview upcoming invoice: ' . $e->getMessage());
            return [];
        }
    }

    public function getUnusedCredit(object $preview): float
    {
        $unusedCredit = 0;
        foreach ($preview->lines->data as $line) {
            $isProration = $line->parent->subscription_item_details->proration ?? false;

            if ($isProration) {
                if ($line->amount < 0) {
                    // Negative amount = credit for unused time
                    $unusedCredit += abs($line->amount);
                }
            }
        }
        return $unusedCredit / 100; // Convert cents to dollars
    }
    
    public function calculateUpgradeProration(object $preview): array
    {
        $newPlanChargeCents = 0;      // Positive amount for new plan
        $oldPlanCreditCents = 0;      // Negative amount for old plan credit
        $netChargeCents = 0;

        foreach ($preview->lines->data as $line) {
            $isProration = $line->parent->subscription_item_details->proration ?? false;

            if ($isProration) {
                if ($line->amount < 0) {
                    // Credit for unused time on old plan (Pro plan)
                    $oldPlanCreditCents += abs($line->amount);
                } else {
                    // Charge for remaining time on new plan (Enterprise plan)
                    $newPlanChargeCents += $line->amount;
                }
                
                // Net total (what customer pays today)
                $netChargeCents += $line->amount;
            }
        }

        return [
            'unused_credit_on_old_plan' => round($oldPlanCreditCents / 100, 2),    // $9.50
            'remaining_cost_on_new_plan' => round($newPlanChargeCents / 100, 2),    // $49.50
            'net_adjustment_due_today' => round($netChargeCents / 100, 2),              // $40.00
            'currency' => strtolower($preview->currency)
        ];
    }
    
    public function previewProration(string $planSlug): array
    {
        $user = auth()->user();
        $planService = app(PlanService::class);
        $subscriptionService = app(SubscriptionService::class);
        
        $targetPlan = $planService->getPlan($planSlug ?? '');
        $currentPlan = $planService->getActivePlan($user);

        if($currentPlan && $targetPlan['price_id'] === $currentPlan['price_id']):
            return [
                'response'=> [
                    'action_type' => 'same_plan',
                    'proration' => null,
                    'message' => 'You are already on this plan.'
                ],
                'status_code' => 422
            ];
        endif;

        if ($targetPlan['price'] < $currentPlan['price']) {
            $subscription = $subscriptionService->getActiveSubscription($user);
            // Grab the period end timestamp from your DB subscription record
            $periodEnd = $subscription->ends_at ?? now()->addMonth(); 

            return [
                'response'=> [
                    'action_type' => 'downgrade',
                    'proration' => null,
                    'downgradePrevent' => [
                        'amount_due_today' => 0,
                        'next_billing_amount' => $targetPlan['price'],
                        'effective_date' => $periodEnd->toIso8601String(),
                        'message' => "You will keep your {$currentPlan['name']} features until the end of your billing cycle. Your plan will automatically switch to {$targetPlan['name']} on renewal."
                    ]
                ],
                'status_code' => 200
            ];
        }

        $newPriceId = $targetPlan['price_id'] ?? '';
        $activeSub = $subscriptionService->getActiveSubscription($user);

        $stripeSubscription =  $activeSub->asStripeSubscription();
        // $subscriptionItemId = $stripeSubscription->items->data[0]->id;

        // Log::info('SUB', ['SUBSCRIPTION'=> $stripeSubscription]);
        $preview = $this->previewUpcomingInvoice($stripeSubscription, true, $newPriceId) ?? null;
        // Log::info('PREVIEW', ['PREVIEW'=> $preview]);
        // Log::info('preview data type', ['type' => gettype($preview)]);
        // $unusedCredit = $this->getUnusedCredit($preview);
        $prorationDetails = $this->calculateUpgradeProration($preview);
        Log::info('PRORATION', ['PRORATION'=> $prorationDetails]);

        return [
            'response'=> [
                'action_type' => 'upgrade',
                'proration' => $prorationDetails,
                'downgradePrevent' => null
            ],
            'status_code' => 200
        ];
    }
}