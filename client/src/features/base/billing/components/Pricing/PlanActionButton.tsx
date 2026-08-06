// components/PlanActionButton.tsx
import type { UserPlanSchema } from "../../types";

interface PlanActionButtonProps {
  plan: UserPlanSchema;
  hasActiveSubscription: boolean;
  isPreviewPending: boolean;
  isCheckoutPending: boolean;
  previewSlug?: string;
  checkoutSlug?: string;
  onSwitchPlan: (slug: string) => void;
  onSubscribe: (slug: string) => void;
}

export function PlanActionButton({
  plan,
  hasActiveSubscription,
  isPreviewPending,
  isCheckoutPending,
  previewSlug,
  checkoutSlug,
  onSwitchPlan,
  onSubscribe,
}: PlanActionButtonProps) {
  if (plan.is_current) {
    return (
      <button className="btn btn-block btn-disabled font-bold" disabled>
        Current Plan
      </button>
    );
  }

  const isPrimary = plan.slug === "pro";
  const btnClass = `btn btn-block font-bold ${isPrimary ? "btn-primary" : "btn-outline"}`;

  if (hasActiveSubscription) {
    const isLoading = isPreviewPending && previewSlug === plan.slug;
    return (
      <button className={btnClass} onClick={() => onSwitchPlan(plan.slug)} disabled={isPreviewPending}>
        {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Switch to this Plan"}
      </button>
    );
  }

  const isLoading = isCheckoutPending && checkoutSlug === plan.slug;
  return (
    <button className={btnClass} onClick={() => onSubscribe(plan.slug)} disabled={isCheckoutPending}>
      {isLoading ? <span className="loading loading-spinner loading-sm" /> : `Get Started with ${plan.name}`}
    </button>
  );
}