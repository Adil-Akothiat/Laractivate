// ==========================================
// 2. Data Schemas
// ==========================================
export interface PlanSchema {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval?: 'month' | 'year' | string; // 🟢 Added this line to fix ts(2339)
  features: string[];
}

export interface UserPlanSchema extends PlanSchema {
  is_current: boolean;
}

export interface UserPlanSchemaResponse {
  meta: {
    current_plan_slug?:string
    has_active_subscription:boolean
  }
  plans: UserPlanSchema[];
}

export interface InvoiceSchema {
  id: string;
  total: number;
  subtotal: number;
  currency: string;
  status: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  created_at: string;
}

export interface ActiveSubscriptionSchema {
  subscription_id: string | null;
  status: string | null;
  plan: {
    name: string;
    slug: string;
    price: number;
    currency: string;
    interval: string;
  } | null;
  renews_at: string | null;
  ends_at: string | null;
  on_grace_period: boolean;
}

export interface ProrationPreviewSchema {
  unused_credit_on_old_plan: number,
  remaining_cost_on_new_plan: number,
  net_adjustment_due_today: number,
  currency: string
}

// ==========================================
// 3. Params
// ==========================================
export interface FilterInvoicesParams {
  page?: number;
  per_page?: number;
  status?: 'paid' | 'open' | 'uncollectible' | 'void';
}

// ==========================================
// 4. UI Props
// ==========================================
export interface PricingGridProps {
    plans: PlanSchema[];
    showTitle?: boolean;
    /**
     * Render the CTA button for each plan.
     * Gives full control to the parent (public vs authenticated).
     */
    renderAction: (plan: PlanSchema) => React.ReactNode;
}

export interface InvoicesTableProps {
  limit?: number;
}

// ==========================================
// 5. Form Values
// ==========================================
// Billing settings forms typically capture promotional coupons or checkout parameters
export interface CouponFormValues {
  code: string;
}

// ==========================================
// 6. Request Payloads
// ==========================================
export interface CreateCheckoutPayload {
  plan_slug: string;
}

export interface CheckoutUrlSchema {
  url: string;
}

export interface PortalUrlSchema {
  url: string;
}
