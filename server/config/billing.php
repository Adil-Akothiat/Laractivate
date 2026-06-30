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
    | Keep cosmetic values (price, interval, currency) explicitly declared here 
    | to eliminate network performance latency and maintain full visual layout control.
    |
    */
    'plans' => [
        'pro' => [
            'name'        => 'Pro Plan',
            'slug'        => 'pro',
            'description' => 'Advanced features and complete architecture scaling capabilities.',
            'price'       => 19,
            'currency'    => 'usd',
            'interval'    => 'month',
            'price_id'    => env('STRIPE_PRICE_PRO'),
            'features'    => [
                'Unlimited Projects',
                'Advanced Permissions System',
                '24/7 Priority Support',
            ],
            'is_active'   => true,
        ],

        // 🟢 Simply append your new plan here!
        'enterprise' => [
            'name'        => 'Enterprise Plan',
            'slug'        => 'enterprise',
            'description' => 'Custom configurations and dedicated infrastructure for growing teams.',
            'price'       => 99,
            'currency'    => 'usd',
            'interval'    => 'month',
            'price_id'    => env('STRIPE_PRICE_ENTERPRISE'), // Add this to your local .env file
            'features'    => [
                'Everything in Pro',
                'Custom SSO / SAML Authentication',
                'Dedicated Database Clusters',
                'SLA Guarantee & Phone Support',
            ],
            'is_active'   => true,
        ],
    ]
];