import { useMutation } from '@tanstack/react-query';
import { billingApi } from '../../api';
import type { CheckoutSessionPayload } from '../../types';
import { useToastContext } from '@/app/hooks';
import { getErrorsMessagesStr } from '@/app/utils';

export const useBillingMutations = () => {
  const { toast } = useToastContext();

  const createCheckoutMutation = useMutation({
    mutationFn: (payload: CheckoutSessionPayload) => billingApi.createCheckoutSession(payload),
    onSuccess: (data) => {
      if (data.url) {
        // Direct browser transfer off to Stripe's secure hosted payment processing checkout forms
        window.location.href = data.url;
      } else {
        toast.error('Failed to retrieve a valid payment URL.');
      }
    },
    onError: (error: any) => {
      toast.error(getErrorsMessagesStr(error));
    },
  });

  return {
    createCheckoutMutation,
  };
};