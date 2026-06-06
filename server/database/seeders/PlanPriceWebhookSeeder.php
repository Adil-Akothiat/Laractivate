<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;
use App\Models\PlanPrice;

class PlanPriceWebhookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed the core Parent Plan containing your feature listings
        $proPlan = Plan::updateOrCreate(
            ['slug' => 'pro-plan'],
            [
                'name'        => 'Pro Plan',
                'description' => 'Perfect for full-stack developers launching SaaS products.',
                'features'    => json_encode([
                    'Unlimited workspace configurations',
                    'Advanced multi-tenant authentication patterns',
                    'Dedicated boilerplate support channels'
                ]),
                'is_active'   => true, // Make sure this matches your `plans` schema layout
            ]
        );

        // 2. Seed your REAL Stripe dashboard price key (Optional for your future live checkouts)
        // PlanPrice::updateOrCreate(
        //     ['stripe_price_id' => 'price_1QxxxxxYOUR_REAL_STRIPE_DASHBOARD_KEY'],
        //     [
        //         'plan_id'           => $proPlan->id,
        //         'currency'          => 'USD',
        //         'amount'            => 1900, 
        //         'interval'          => 'month',
        //         'stripe_product_id' => 'prod_xxxxxxYOUR_REAL_PRODUCT_ID',
        //     ]
        // );

        // 3. 🟢 Cleaned up to match your exact ERD columns from Screenshot_89.png!
        PlanPrice::updateOrCreate(
            ['stripe_price_id' => 'price_1TZvINAdMDFZJJUKMOheoISV'], 
            [
                'plan_id'           => $proPlan->id, 
                'currency'          => 'USD',
                'amount'            => 1900, 
                'interval'          => 'month',
                'stripe_product_id' => 'prod_mock123456',
            ]
        );
    }
}