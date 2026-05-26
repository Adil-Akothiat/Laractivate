import React from 'react';
import { useBillingMutations } from '../hooks/api/useBillingMutations';
import type { PlanDetailsSchema } from "../types"
import Card from '@/components/Card';
import Button from '@/components/Button';

const PLANS: PlanDetailsSchema[] = [
  {
    title: 'Free Plan',
    slug: 'free',
    price: '$0',
    features: ['Standard authentication options', 'Basic profile dashboard', '2 active sessions limit'],
    cta: 'Current Plan',
    popular: false,
  },
  {
    title: 'Pro Developer Tier',
    slug: 'pro', // Matches configuration array structure keys inside Laravel config/billing.php
    price: '$19',
    features: ['Full application state parameters', 'Advanced RBAC permission layers', 'Infinite concurrent connections', 'Priority developer support streams'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
];

export const PricingGrid: React.FC = () => {
  const { createCheckoutMutation } = useBillingMutations();

  const handleSubscriptionPurchase = (planSlug: string) => {
    if (planSlug === 'free') return;
    createCheckoutMutation.mutate({ plan_slug: planSlug });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-8 px-4">
      {PLANS.map((plan) => (
        <Card 
          key={plan.slug} 
          className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all ${
            plan.popular ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </span>
          )}
          
          <div>
            <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
            <div className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
            </div>
            
            <ul className="mt-6 space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => handleSubscriptionPurchase(plan.slug)}
              disabled={plan.slug === 'free' || createCheckoutMutation.isPending}
              className="w-full justify-center"
              variant={plan.popular ? 'primary' : 'secondary'}
            >
              {createCheckoutMutation.isPending && plan.slug !== 'free' ? 'Redirecting...' : plan.cta}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};