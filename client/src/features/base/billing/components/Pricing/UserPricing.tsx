import { DataLoader } from "@/components/Loaders/DataLoader";
import { useUserPricingQuery } from "../../hooks/api/useBillingQueries";
import { PricingGrid } from "../PricingGrid";
import { PlanSwitchModal } from "./PlanSwitchModal";
import { PlanActionButton } from "./PlanActionButton";
import { usePlanSwitch } from "../../hooks/ui/usePlanSwitch";
import type { UserPlanSchema } from "../../types";
import { CheckoutAlert } from "./CheckoutAlert";

export default function UserPricing() {
  const query = useUserPricingQuery();
  const { state, mutations, actions } = usePlanSwitch();

  return (
    <>
      <CheckoutAlert />
      <DataLoader query={query}>
        {(data) => (
          <PricingGrid
            plans={data.plans}
            renderAction={(plan) => (
              <PlanActionButton
                plan={plan as UserPlanSchema}
                hasActiveSubscription={data.meta.has_active_subscription}
                isPreviewPending={mutations.previewProration.isPending}
                isCheckoutPending={mutations.checkout.isPending}
                previewSlug={mutations.previewProration.variables?.plan_slug}
                checkoutSlug={mutations.checkout.variables?.plan_slug}
                onSwitchPlan={actions.handleSwitchPlan}
                onSubscribe={actions.subscribeCheckoutHandler}
              />
            )}
          />
        )}
      </DataLoader>

      <PlanSwitchModal
        isOpen={state.confirmOpen}
        preview={state.preview}
        downgradeResult={state.downgradeResult}
        isUpgradePending={mutations.upgrade.isPending}
        isDowngradePending={mutations.downgrade.isPending}
        onCancel={actions.handleCancel}
        onConfirmUpgrade={actions.handleConfirmUpgrade}
        onConfirmDowngrade={actions.handleConfirmDowngrade}
      />
    </>
  );
}