import { useState } from "react";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { useUserPricingQuery } from "../hooks/api/useBillingQueries";
import { useBillingMutations } from "../hooks/api/useBillingMutations";
import { PricingGrid } from "./PricingGrid";
import type { UserPlanSchema, ProrationPreviewSchema } from "../types";
import { Modal } from "@/components";
import Button from "@/components/Button";
import { ArrowRight, CreditCard } from "lucide-react";
import ProrationBreakdown from "./ProrationBreakdown";

export default function UserPricing() {
  const query = useUserPricingQuery();
  const { usePreviewUpgrade, useCheckoutMutation, useSubscriptionUpgrade } = useBillingMutations();

  const previewUpgrade = usePreviewUpgrade();
  const checkout = useCheckoutMutation();
  const upgrade = useSubscriptionUpgrade();

  const [preview, setPreview] = useState<ProrationPreviewSchema | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planSlug, setPlanSlug] = useState<string>('');

  const handleSwitchPlan = async (slug: string) => {
    try {
      const res = await previewUpgrade.mutateAsync({ plan_slug: slug });
      // Clean structure mapping based on your expected nested backend format
      setPreview(res.data);
      setConfirmOpen(true);
      setPlanSlug(slug);
    } catch (error) {
      console.error("Failed to fetch proration preview:", error);
    }
  };

  const handleConfirmUpgrade = () => {
    upgrade.mutate(
      { plan_slug: planSlug },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setPreview(null);
          setPlanSlug('');
        },
        onError: (error) => {
          console.error("Upgrade execution failed:", error);
          // Optional: Add a toast notification helper here to inform the user
        }
      }
    );
  };

  const handleCancel = () => {
    // Only allow canceling if an upgrade action isn't actively flying
    if (upgrade.isPending) return;
    
    setConfirmOpen(false);
    setPreview(null);
    setPlanSlug('');
  };
  
  return (
    <>
      <DataLoader query={query}>
        {(data) => {
          const { meta, plans } = data;
          console.log(meta, plans);
          return (
            <PricingGrid
              plans={plans}
              renderAction={(plan) => {
                const userPlan = plan as UserPlanSchema;

                if (userPlan.is_current) {
                  return (
                    <button className="btn btn-block btn-disabled font-bold" disabled>
                      Current Plan
                    </button>
                  );
                }

                if (meta.has_active_subscription) {
                  return (
                    <button
                      className={`btn btn-block font-bold ${
                        plan.slug === "pro" ? "btn-primary" : "btn-outline"
                      }`}
                      onClick={() => handleSwitchPlan(plan.slug)}
                      disabled={previewUpgrade.isPending}
                    >
                      {previewUpgrade.isPending && previewUpgrade.variables?.plan_slug === plan.slug ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        "Switch to this Plan"
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    className={`btn btn-block font-bold ${
                      plan.slug === "pro" ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => checkout.mutate({ plan_slug: plan.slug })}
                    disabled={checkout.isPending}
                  >
                    {checkout.isPending && checkout.variables?.plan_slug === plan.slug ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      `Get Started with ${plan.name}`
                    )}
                  </button>
                );
              }}
            />
          );
        }}
      </DataLoader>

      <Modal
        isOpen={confirmOpen}
        onClose={handleCancel}
        title="Confirm Plan Switch"
        size="sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              disabled={upgrade.isPending} // Disable cancel button when saving
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmUpgrade}
              className="gap-1.5"
              loading={upgrade.isPending} // Spinner displays inside button while loading is true
            >
              <CreditCard size={14} />
              Confirm & Pay
              <ArrowRight size={14} />
            </Button>
          </div>
        }
      >
        {preview ? (
          <ProrationBreakdown preview={preview} />
        ) : (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner loading-md" />
          </div>
        )}
      </Modal>
    </>
  );
}