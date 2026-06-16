import type { ProrationPreviewSchema } from "../types";
import { formatCurrency } from "../utils";

export default function ProrationBreakdown({ preview }: { preview: ProrationPreviewSchema }) {
  const isNetCredit = preview.net_adjustment_due_today < 0;

  // Force absolute values for the breakdown rows to keep layout signs under our control
  const absoluteCreditValue = Math.abs(preview.unused_credit_on_old_plan);
  const absoluteNewCostValue = Math.abs(preview.remaining_cost_on_new_plan);
  const absoluteNetValue = Math.abs(preview.net_adjustment_due_today);

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/60">
        Here's the prorated breakdown for switching your plan today.
      </p>

      <div className="rounded-xl border border-base-200 overflow-hidden">
        {/* 1. Unused Credit Row */}
        <div className="flex items-center justify-between px-4 py-3 bg-base-100">
          <span className="text-sm text-base-content/70">
            Unused credit on current plan
          </span>
          <span className="text-sm font-medium text-success">
            −{formatCurrency(absoluteCreditValue, preview.currency)}
          </span>
        </div>

        <div className="h-px bg-base-200" />

        {/* 2. New Plan Cost Row */}
        <div className="flex items-center justify-between px-4 py-3 bg-base-100">
          <span className="text-sm text-base-content/70">
            Remaining cost on new plan
          </span>
          <span className="text-sm font-medium text-base-content">
            {formatCurrency(absoluteNewCostValue, preview.currency)}
          </span>
        </div>

        <div className="h-px bg-base-200" />

        {/* 3. Net Balance Adjustment Row */}
        <div className="flex items-center justify-between px-4 py-3 bg-base-50 text-xs italic text-base-content/70">
          <span>{isNetCredit ? "Net adjustment (Credit back)" : "Net adjustment (Difference)"}</span>
          <span className={isNetCredit ? "text-success font-medium" : "font-medium"}>
            {isNetCredit ? "−" : ""}
            {formatCurrency(absoluteNetValue, preview.currency)}
          </span>
        </div>

        <div className="h-px bg-base-200" />

        {/* 4. Ultimate UX Winner: Charged Today Row */}
        <div className={`flex items-center justify-between px-4 py-4 ${isNetCredit ? 'bg-base-100' : 'bg-base-200/60'}`}>
          <span className="text-sm font-bold text-base-content">
            Charged today
          </span>
          <span className="text-lg font-extrabold text-base-content">
            {isNetCredit 
              ? formatCurrency(0, preview.currency) // Explicitly display $0.00 on downgrade credit
              : formatCurrency(absoluteNetValue, preview.currency) // Display the positive delta total
            }
          </span>
        </div>
      </div>

      {/* Contextual description alert */}
      {isNetCredit ? (
        <p className="text-xs text-success/80 bg-success/10 p-3 rounded-lg border border-success/10 font-medium">
          Your card will not be charged today. The remaining credit balance of <strong>−{formatCurrency(absoluteNetValue, preview.currency)}</strong> will be safely added to your profile to lower your upcoming monthly bills automatically!
        </p>
      ) : (
        <p className="text-xs text-base-content/40">
          This immediate charge completes your upgrade cycle. Your tier access upgrades instantly.
        </p>
      )}
    </div>
  );
}