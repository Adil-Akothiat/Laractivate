// hooks/usePlanSwitch.ts
import { useState } from "react";
import { useToastContext } from "@/app/hooks";
import { useBillingMutations } from "../api/useBillingMutations";
import { ProrationResponseSchema } from "../../types";

export type DowngradeResult =
  | { status: "success"; message: string }
  | { status: "already_scheduled"; message: string };

export function usePlanSwitch() {
  const { usePreviewProration, useCheckoutMutation, useSubscription } = useBillingMutations();

  const previewProration = usePreviewProration();
  const checkout = useCheckoutMutation();
  const { upgrade, downgrade } = useSubscription();

  const [preview, setPreview] = useState<ProrationResponseSchema | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [planSlug, setPlanSlug] = useState<string>("");
  const [downgradeResult, setDowngradeResult] = useState<DowngradeResult | null>(null);

  const { toast } = useToastContext();

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
        onSuccess: (res) => {
          setConfirmOpen(false);
          setPreview(null);
          setPlanSlug("");
          // console.log()
          toast.success(res.message || '');
        },
        onError: (error) => console.error("Upgrade failed:", error),
      }
    );
  };

  const handleConfirmDowngrade = () => {
    downgrade.mutate(
      { plan_slug: planSlug },
      {
        onSuccess: (res) => {
          setDowngradeResult({ status: "success", message: res.message || "" });
          setPlanSlug("");
          setPreview(null);
          toast.success(res.message || "");
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ??
            "A downgrade is already scheduled for your account.";
          setDowngradeResult({ status: "already_scheduled", message });
          setPlanSlug("");
          setPreview(null);
        },
      }
    );
  };

  const subscribeCheckoutHandler = (slug: string) => {
    checkout.mutate({ plan_slug: slug });
  };

  const handleCancel = () => {
    if (upgrade.isPending || downgrade.isPending) return;
    setConfirmOpen(false);
    setPreview(null);
    setPlanSlug("");
    setDowngradeResult(null);
  };

  return {
    state: { preview, confirmOpen, downgradeResult },
    mutations: { previewProration, checkout, upgrade, downgrade },
    actions: {
      handleSwitchPlan,
      handleConfirmUpgrade,
      handleConfirmDowngrade,
      subscribeCheckoutHandler,
      handleCancel,
    },
  };
}