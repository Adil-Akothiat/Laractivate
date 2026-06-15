import { DataLoader } from "@/components/Loaders/DataLoader";
import type { ActiveSubscriptionSchema } from "@/features/base/billing";
import { useSubscriptionOverview } from "@/features/base/settings/hooks";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    className: "badge-success",
    icon: <CheckCircle2 size={12} />,
  },
  trialing: {
    label: "Trial",
    className: "badge-info",
    icon: <Clock size={12} />,
  },
  past_due: {
    label: "Past Due",
    className: "badge-error",
    icon: <XCircle size={12} />,
  },
  canceled: {
    label: "Canceled",
    className: "badge-ghost",
    icon: <XCircle size={12} />,
  },
  inactive: {
    label: "Inactive",
    className: "badge-ghost",
    icon: <XCircle size={12} />,
  },
};

function PlanCard({ sub }: { sub: ActiveSubscriptionSchema }) {
  const statusCfg =
    STATUS_CONFIG[sub.status ?? "inactive"] ?? STATUS_CONFIG.inactive;

  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-5 space-y-4">
      {/* Plan header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-base-content/40 uppercase tracking-widest mb-1">
            Current Plan
          </p>
          <h3 className="text-lg font-bold text-base-content capitalize">
            {sub.plan?.name ?? "—"}
          </h3>
          {sub.plan && (
            <p className="text-sm text-base-content/50 mt-0.5">
              {formatCurrency(sub.plan.price, sub.plan.currency)}
              <span className="text-xs"> / {sub.plan.interval}</span>
            </p>
          )}
        </div>

        <span
          className={`badge badge-soft badge-sm gap-1 ${statusCfg.className}`}
        >
          {statusCfg.icon}
          {statusCfg.label}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-base-content/10" />

      {/* Renewal / expiry info */}
      <div className="text-sm text-base-content/60">
        {sub.on_grace_period && sub.ends_at ? (
          <p>
            Access until{" "}
            <span className="font-medium text-base-content">
              {formatDate(sub.ends_at)}
            </span>
          </p>
        ) : sub.renews_at ? (
          <p>
            Renews on{" "}
            <span className="font-medium text-base-content">
              {formatDate(sub.renews_at)}
            </span>
          </p>
        ) : (
          <p className="text-base-content/30 italic">
            No renewal date available
          </p>
        )}
      </div>
    </div>
  );
}

function AlertBanners({ sub }: { sub: ActiveSubscriptionSchema }) {
  return (
    <div className="space-y-2">
      {/* Grace period warning */}
      {sub.on_grace_period && sub.ends_at && (
        <div role="alert" className="alert alert-warning py-3">
          <AlertTriangle size={16} />
          <span className="text-sm">
            Your subscription was canceled and will remain active until{" "}
            <strong>{formatDate(sub.ends_at)}</strong>. Resubscribe to avoid
            losing access.
          </span>
        </div>
      )}

      {/* Past due warning */}
      {sub.status === "past_due" && (
        <div role="alert" className="alert alert-error py-3">
          <XCircle size={16} />
          <span className="text-sm">
            Your last payment failed. Please update your payment method to keep
            your subscription active.
          </span>
        </div>
      )}

      {/* Trial warning */}
      {sub.status === "trialing" && sub.renews_at && (
        <div role="alert" className="alert alert-info py-3">
          <Clock size={16} />
          <span className="text-sm">
            You're on a free trial. It ends on{" "}
            <strong>{formatDate(sub.renews_at)}</strong>.
          </span>
        </div>
      )}
    </div>
  );
}

function NoSubscription() {
  return (
    <div className="rounded-xl border border-dashed border-base-300 p-10 text-center space-y-2">
      <p className="text-base-content/50 text-sm">
        You don't have an active subscription.
      </p>
    </div>
  );
}

export default function SubscriptionOverview() {
  const query = useSubscriptionOverview();

  return (
    <DataLoader query={query}>
      {(sub: ActiveSubscriptionSchema | null) => {
        if (!sub) return;
        <NoSubscription />;
        return (
          <div className="space-y-4">
            <AlertBanners sub={sub} />
            <PlanCard sub={sub} />
          </div>
        );
      }}
    </DataLoader>
  );
}