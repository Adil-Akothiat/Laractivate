<?php

return [
    /*
    |--------------------------------------------------------------------------
    | SaaS Application Pricing Plans
    |--------------------------------------------------------------------------
    |
    | This array defines the pricing tiers available in your boilerplate.
    | Developers using your boilerplate can easily add, remove, or modify
    | these plans to match their product's billing structure.
    |
    */

    'plans' => [
        'pro' => [
            'name' => 'Pro Plan',
            'slug' => 'pro',
            'price_id' => env('STRIPE_PRICE_PRO'),
            'features' => [
                'Unlimited Projects',
                'Advanced Permissions System',
                '24/7 Priority Support',
            ],
        ],
    ]
];