import { useMutation } from '@tanstack/react-query';
import type { CreateCheckoutPayload } from '../../types';
import { billingApi } from '../../api';

export const useBillingMutations = () => {
  return {
    /**
     * Mutation handler for forwarding user out to Stripe hosted payment gateways
    */
    useCheckoutMutation: () => 
      useMutation({
        mutationFn: async (payload: CreateCheckoutPayload) => {
          const { data } = await billingApi.createCheckout(payload);
          return data;
        },
        onSuccess: (data) => {
          if (data.url) {
            window.location.href = data.url; // Trigger secure external boundary transition
          }
        },
      }),

    /**
     * Mutation handler for loading Stripe customer payment card overlay panel links
     */
    usePortalMutation: () => 
      useMutation({
        mutationFn: async () => {
          const { data } = await billingApi.createPortal();
          return data;
        },
        onSuccess: (data) => {
          if (data.url) {
            window.location.href = data.url;
          }
        },
      }),

      usePreviewUpgrade: ()=> useMutation({
        mutationFn: (payload:CreateCheckoutPayload) =>  billingApi.previewUpgrade(payload)
      }),
      
      useSubscriptionUpgrade: ()=> useMutation({
        mutationFn: () =>  billingApi.upgradeSubscription()
      
      })
  };
};