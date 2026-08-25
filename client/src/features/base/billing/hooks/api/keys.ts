import type { FilterInvoicesParams } from "../../types";

export const billingKeys = {
  all: ['billing'] as const,
  pricing: () => [...billingKeys.all, 'pricing'] as const,
  invoices: () => [...billingKeys.all, 'invoices'] as const,
  invoiceLists: (filters: FilterInvoicesParams) => [...billingKeys.invoices(), { filters }] as const,
  subscription: () => [...billingKeys.all, 'current-subscription'] as const,
  paymentMethods: ()=> [...billingKeys.all, 'payment-methods'] as const
};