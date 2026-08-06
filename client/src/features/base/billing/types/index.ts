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

export interface PendingDowngradeSchema {
  id: string;
  plan_name: string;
  plan_slug: string;
  transitions_at: string;
}

export interface NextInvoiceSchema {
  amount: number;
  currency: string;
  billing_at: string;
}

export interface ActiveSubscriptionSchema {
  id: string;
  status: string | null;
  plan: {
    name: string;
    slug: string;
    price: number;
    currency: string;
    interval: string;
  };
  ends_at: string | null;
  on_grace_period: boolean;
  pending_downgrade: PendingDowngradeSchema | null,
  next_invoice: NextInvoiceSchema | null,
  can_cancel: boolean;
  can_resume: boolean;
}

export interface ProrationPreviewSchema {
  unused_credit_on_old_plan: number,
  remaining_cost_on_new_plan: number,
  net_adjustment_due_today: number,
  currency: string
}

export interface DownGradePreventSchema {
  message: string,
  amount_due_today: number,
  next_billing_amount: number,
  effective_date: string
}

export interface ProrationResponseSchema {
  action_type: 'upgrade' | 'downgrade',
  proration?: ProrationPreviewSchema,
  downgradePrevent?: DownGradePreventSchema
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
