// components/PlanSwitchModal.tsx
import { Modal } from "@/components";
import Button from "@/components/Button";
import { ArrowRight, CreditCard, AlertTriangle, CalendarClock, CheckCircle, XCircle } from "lucide-react";
import ProrationBreakdown from "../ProrationBreakdown";
import type { ProrationResponseSchema } from "../../types";
import type { DowngradeResult } from "../../hooks/ui/usePlanSwitch"

interface PlanSwitchModalProps {
  isOpen: boolean;
  preview: ProrationResponseSchema | null;
  downgradeResult: DowngradeResult | null;
  isUpgradePending: boolean;
  isDowngradePending: boolean;
  onCancel: () => void;
  onConfirmUpgrade: () => void;
  onConfirmDowngrade: () => void;
}

export function PlanSwitchModal({
  isOpen,
  preview,
  downgradeResult,
  isUpgradePending,
  isDowngradePending,
  onCancel,
  onConfirmUpgrade,
  onConfirmDowngrade,
}: PlanSwitchModalProps) {
  const isDowngrade = preview?.action_type === "downgrade";

  // Modal Title
  const title = downgradeResult
    ? downgradeResult.status === "success"
      ? "Downgrade Scheduled"
      : "Already Scheduled"
    : isDowngrade
    ? "Schedule Plan Downgrade"
    : "Confirm Plan Switch";

  // Modal Footer Buttons
  const renderFooter = () => {
    if (downgradeResult) {
      return (
        <div className="flex w-full justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Close
          </Button>
        </div>
      );
    }

    if (isDowngrade) {
      return (
        <div className="flex gap-2 w-full justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isDowngradePending}>
            Cancel
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={onConfirmDowngrade}
            className="gap-1.5"
            loading={isDowngradePending}
          >
            <CalendarClock size={14} />
            Schedule Downgrade
            <ArrowRight size={14} />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 w-full justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={isUpgradePending}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirmUpgrade}
          className="gap-1.5"
          loading={isUpgradePending}
        >
          <CreditCard size={14} />
          Confirm & Pay
          <ArrowRight size={14} />
        </Button>
      </div>
    );
  };

  // Modal Body Content
  const renderBody = () => {
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
          {isSuccess ? <CheckCircle size={18} className="mt-0.5 shrink-0" /> : <XCircle size={18} className="mt-0.5 shrink-0" />}
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
      const { message, amount_due_today, next_billing_amount, effective_date } = preview.downgradePrevent;
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
        </div>
      );
    }

    if (preview.proration) {
      return <ProrationBreakdown preview={preview.proration} />;
    }

    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm" footer={renderFooter()}>
      {renderBody()}
    </Modal>
  );
}