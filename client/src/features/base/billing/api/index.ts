import { api } from '@/app/services/api';
import type {
  InvoiceSchema, 
  FilterInvoicesParams, 
  CreateCheckoutPayload,
  CheckoutUrlSchema,
  PortalUrlSchema,
  ActiveSubscriptionSchema,
  PlanSchema,
  UserPlanSchemaResponse,
  ProrationPreviewSchema
} from '../types';
import type { ApiResponseSchema } from '@/app/types';

const BASE_ROUTE = '/billing';

export const billingApi = {
  // --- Core Methods ---
  
  /**
   * Fetch public config-driven plans configuration listing matrix
   */
  listPricing: () => 
    api.get<ApiResponseSchema<PlanSchema[]>>(`${BASE_ROUTE}/pricing`),
  
  listUserPricing: () => 
    api.get<ApiResponseSchema<UserPlanSchemaResponse>>(`${BASE_ROUTE}/user-pricing`),

  /**
   * Fetch secure transaction and invoice payment logs history
   */
  listInvoices: (params?: FilterInvoicesParams) => 
    api.get<ApiResponseSchema<InvoiceSchema[]>>(`${BASE_ROUTE}/invoices`, { params }),

  // --- Custom Actions ---

  /**
   * Initiate dynamic Stripe Checkout link redirection session
   */
  createCheckout: (payload: CreateCheckoutPayload) => 
    api.post<CheckoutUrlSchema>(`${BASE_ROUTE}/checkout`, payload),

  /**
   * Generate secure self-service customer Stripe billing portal redirection hub
   */
  createPortal: () => 
    api.post<PortalUrlSchema>(`${BASE_ROUTE}/portal`),

  /**
   * Fetch user subscription state lifecycle records
   */
  getSubscription: () => 
    api.get<ActiveSubscriptionSchema>(`${BASE_ROUTE}/subscription`),
  previewUpgrade: (payload:CreateCheckoutPayload)=> 
    api.post<ApiResponseSchema<ProrationPreviewSchema>>(`${BASE_ROUTE}/subscription/preview-upgrade`, payload),
  upgradeSubscription: ()=> 
    api.get<ActiveSubscriptionSchema>(`${BASE_ROUTE}/subscription/upgrade`),
};