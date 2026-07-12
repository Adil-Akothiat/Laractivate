import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateCheckoutPayload } from '../../types';
import { billingApi } from '../../api';
import { billingKeys } from './keys';

export const useBillingMutations = () => {
  const queryClient = useQueryClient();
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

      usePreviewProration: ()=> useMutation({
        mutationFn: async (payload:CreateCheckoutPayload) =>  {
          const { data } = await billingApi.previewProration(payload);
          return data;
        }
      }),
      
      useSubscriptionUpgrade: ()=> useMutation({
        mutationFn: async (payload: CreateCheckoutPayload) => {
          const { data } = await  billingApi.upgradeSubscription(payload);
          return data;
        },
        onSuccess: ()=> {
          queryClient.invalidateQueries({ queryKey: billingKeys.pricing() });
        }
      
      }),
      
      useSubscriptionDowngrade: ()=> useMutation({
        mutationFn: async (payload: CreateCheckoutPayload) => {
          const { data } = await  billingApi.downgradeSubscription(payload);
          return data;
        }
      })
  };
};