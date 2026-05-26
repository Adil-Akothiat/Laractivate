export interface CheckoutSessionPayload {
  plan_slug: string;
}

export interface CheckoutSessionSchema {
  url: string;
}

export interface PlanDetailsSchema {
  title: string;
  slug: string;
  price: string;
  features: string[];
  cta: string;
  popular: boolean;
}
