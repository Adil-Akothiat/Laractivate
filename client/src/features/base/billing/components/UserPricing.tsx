import { useEffect, useState } from "react";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { useUserPricingQuery } from "../hooks/api/useBillingQueries";
import { useBillingMutations } from "../hooks/api/useBillingMutations";
import { PricingGrid } from "./PricingGrid";
import type { UserPlanSchema, ProrationResponseSchema } from "../types";
import { Modal } from "@/components";
import Button from "@/components/Button";
import { ArrowRight, CreditCard, AlertTriangle, CalendarClock, CheckCircle, XCircle } from "lucide-react";
import ProrationBreakdown from "./ProrationBreakdown";
import { api } from "@/app/services/api";

type DowngradeResult =
  | { status: "success"; message: string }
  | { status: "already_scheduled"; message: string };

export default function UserPricing() {
  const query = useUserPricingQuery();
  const { usePreviewProration, useCheckoutMutation, useSubscriptionUpgrade, useSubscriptionDowngrade } = useBillingMutations();

  const previewProration = usePreviewProration();
  const checkout = useCheckoutMutation();
  const upgrade = useSubscriptionUpgrade();
  const downgrade = useSubscriptionDowngrade();

  const [preview, setPreview] = useState<ProrationResponseSchema | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planSlug, setPlanSlug] = useState<string>('');
  const [downgradeResult, setDowngradeResult] = useState<DowngradeResult | null>(null);

  const isDowngrade = preview?.action_type === 'downgrade';
  const isActionPending = upgrade.isPending || downgrade.isPending;

  const handleSwitchPlan = async (slug: string) => {
    try {
      const res = await previewProration.mutateAsync({ plan_slug: slug });
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
          console.error("Upgrade failed:", error);
        }
      }
    );
  };

  const handleConfirmDowngrade = () => {
    downgrade.mutate(
      { plan_slug: planSlug },
      {
        onSuccess: (res) => {
          // Backend returns 200 with a success message
          setDowngradeResult({ status: "success", message: res.message||'' });
          setPlanSlug('');
          setPreview(null);
        },
        onError: (error: any) => {
          // Backend returns 422 when a schedule already exists
          const message =
            error?.response?.data?.message ??
            "A downgrade is already scheduled for your account.";
          setDowngradeResult({ status: "already_scheduled", message });
          setPlanSlug('');
          setPreview(null);
        }
      }
    );
  };

  const handleCloseResult = () => {
    setDowngradeResult(null);
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    if (isActionPending) return;
    setConfirmOpen(false);
    setPreview(null);
    setPlanSlug('');
    setDowngradeResult(null);
  };

  useEffect(()=>{
    api.get('/billing/setup')
            .then(response => {
                // setBillingData(response.data);
                // setLoading(false);
                console.log(response);
            })
            .catch(error => {
                // console.error("Failed to initialize billing profile:", error);
                // setLoading(false);
            });
  },[])

  // ─── Modal footer ──────────────────────────────────────────────────────────

  const resultFooter = (
    <div className="flex w-full justify-end">
      <Button variant="ghost" size="sm" onClick={handleCloseResult}>
        Close
      </Button>
    </div>
  );

  const downgradeFooter = (
    <div className="flex gap-2 w-full justify-end">
      <Button variant="ghost" size="sm" onClick={handleCancel} disabled={downgrade.isPending}>
        Cancel
      </Button>
      <Button
        variant="warning"
        size="sm"
        onClick={handleConfirmDowngrade}
        className="gap-1.5"
        loading={downgrade.isPending}
      >
        <CalendarClock size={14} />
        Schedule Downgrade
        <ArrowRight size={14} />
      </Button>
    </div>
  );

  const upgradeFooter = (
    <div className="flex gap-2 w-full justify-end">
      <Button variant="ghost" size="sm" onClick={handleCancel} disabled={upgrade.isPending}>
        Cancel
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleConfirmUpgrade}
        className="gap-1.5"
        loading={upgrade.isPending}
      >
        <CreditCard size={14} />
        Confirm & Pay
        <ArrowRight size={14} />
      </Button>
    </div>
  );

  const modalFooter = downgradeResult
    ? resultFooter
    : isDowngrade
      ? downgradeFooter
      : upgradeFooter;

  // ─── Modal title ───────────────────────────────────────────────────────────

  const modalTitle = downgradeResult
    ? downgradeResult.status === "success"
      ? "Downgrade Scheduled"
      : "Already Scheduled"
    : isDowngrade
      ? "Schedule Plan Downgrade"
      : "Confirm Plan Switch";

  // ─── Modal body ────────────────────────────────────────────────────────────

  const modalBody = () => {
    // Show result alert after downgrade mutation settles (success or 422)
    if (downgradeResult) {
      const isSuccess = downgradeResult.status === "success";
      return (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            isSuccess
              ? "border-success/30 bg-success/10 text-success"
              : "border-warning/30 bg-warning/10 text-warning"
          }`}
        >
          {isSuccess ? (
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p className="text-sm">{downgradeResult.message}</p>
        </div>
      );
    }

    if (!preview) {
      return (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-md" />
        </div>
      );
    }

    if (isDowngrade && preview.downgradePrevent) {
      const { message, amount_due_today, next_billing_amount, effective_date } =
        preview.downgradePrevent;
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 text-warning">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
          <div className="divide-y divide-base-200 rounded-lg border border-base-200 text-sm">
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-base-content/60">Amount due today</span>
              <span className="font-medium">${amount_due_today.toFixed(2)}</span>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-base-content/60">Next billing amount</span>
              <span className="font-medium">${next_billing_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-base-content/60">Effective date</span>
              <span className="font-medium">{effective_date}</span>
            </div>
          </div>
          <p className="text-xs text-base-content/50">
            Your current plan stays active until{" "}
            <span className="font-medium">{effective_date}</span>. The downgrade
            takes effect automatically at the start of the next billing cycle.
          </p>
        </div>
      );
    }

    if (preview.proration) {
      return <ProrationBreakdown preview={preview.proration} />;
    }

    return null;
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
                      disabled={previewProration.isPending}
                    >
                      {previewProration.isPending &&
                      previewProration.variables?.plan_slug === plan.slug ? (
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
        title={modalTitle}
        size="sm"
        footer={modalFooter}
      >
        {modalBody()}
      </Modal>
    </>
  );
}