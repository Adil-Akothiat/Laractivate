import { api } from "@/app/services/api";
import type { CheckoutSessionPayload, CheckoutSessionSchema } from "../types";

export const billingApi = {
  /**
   * Post request to ask Laravel Cashier to spin up a secure Stripe Checkout URL
   */
  createCheckoutSession: async (payload: CheckoutSessionPayload): Promise<CheckoutSessionSchema> => {
    const { data } = await api.post<CheckoutSessionSchema>('/billing/checkout', payload);
    return data;
  },
};