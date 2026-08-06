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

    useSubscription: () => {
      const upgrade = useMutation({
        mutationFn: async (payload: CreateCheckoutPayload) => {
          const { data } = await billingApi.upgradeSubscription(payload);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: billingKeys.pricing() });
        }
      
      });
      
      const downgrade = useMutation({
        mutationFn: async (payload: CreateCheckoutPayload) => {
          const { data } = await billingApi.downgradeSubscription(payload);
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: billingKeys.pricing() });
        },
      });

      const cancel = useMutation({
        mutationFn: async () => {
          const { data } = await billingApi.cancelSubscription();
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
      });

      const cancelScheduledSubscription = useMutation({
        mutationFn: async () => {
          const { data } = await billingApi.cancelScheduledSubscription();
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
      });

      const resume = useMutation({
        mutationFn: async () => {
          const { data } = await billingApi.resumeSubscription();
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
      });

      
      return { upgrade, downgrade, cancel, resume, cancelScheduledSubscription };
    }
  };
};