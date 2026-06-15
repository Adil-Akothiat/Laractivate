import { useState } from "react";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { useUserPricingQuery } from "../hooks/api/useBillingQueries";
import { useBillingMutations } from "../hooks/api/useBillingMutations";
import { PricingGrid } from "./PricingGrid";
import type { UserPlanSchema, ProrationPreviewSchema } from "../types";
import { Modal } from "@/components";
import Button from "@/components/Button";
import { ArrowRight, CreditCard } from "lucide-react";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Math.abs(amount));
}

function ProrationBreakdown({ preview }: { preview: ProrationPreviewSchema }) {
  const isCredit = preview.unused_credit_on_old_plan < 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/60">
        Here's the prorated breakdown for switching your plan today.
      </p>

      <div className="rounded-xl border border-base-200 overflow-hidden">
        {/* Credit row */}
        <div className="flex items-center justify-between px-4 py-3 bg-base-100">
          <span className="text-sm text-base-content/70">
            Unused credit on current plan
          </span>
          <span className="text-sm font-medium text-success">
            {isCredit ? "−" : ""}
            {formatCurrency(preview.unused_credit_on_old_plan, preview.currency)}
          </span>
        </div>

        <div className="h-px bg-base-200" />

        {/* New plan cost row */}
        <div className="flex items-center justify-between px-4 py-3 bg-base-100">
          <span className="text-sm text-base-content/70">
            Remaining cost on new plan
          </span>
          <span className="text-sm font-medium text-base-content">
            {formatCurrency(preview.remaining_cost_on_new_plan, preview.currency)}
          </span>
        </div>

        <div className="h-px bg-base-200" />

        {/* Total row */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-base-200/60">
          <span className="text-sm font-semibold text-base-content">
            Due today
          </span>
          <span className="text-base font-bold text-base-content">
            {formatCurrency(preview.net_adjustment_due_today, preview.currency)}
          </span>
        </div>
      </div>

      <p className="text-xs text-base-content/40">
        This charge will appear on your next invoice. Your new plan takes effect immediately.
      </p>
    </div>
  );
}

export default function UserPricing() {
  const query = useUserPricingQuery();
  const { usePreviewUpgrade, useCheckoutMutation } = useBillingMutations();

  const previewUpgrade = usePreviewUpgrade();
  const checkout = useCheckoutMutation();

  const [preview, setPreview] = useState<ProrationPreviewSchema | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSwitchPlan = async (slug: string) => {
    const res = await previewUpgrade.mutateAsync({ plan_slug: slug });
    setPreview(res.data.data);
    setConfirmOpen(true);
  };

  const handleConfirmUpgrade = async () => {
    alert("confirm checkout");
    setConfirmOpen(false);
    setPreview(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPreview(null);
  };

  return (
    <>
      <DataLoader query={query}>
        {(data) => {
          const { meta, plans } = data;
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
                      {previewUpgrade.isPending ? (
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
                    {checkout.isPending &&
                    checkout.variables?.plan_slug === plan.slug ? (
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
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmUpgrade}
              className="gap-1.5"
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