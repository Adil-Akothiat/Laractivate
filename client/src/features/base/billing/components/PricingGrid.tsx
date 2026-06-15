import React from "react";
import type { PricingGridProps } from "../types";

export const PricingGrid: React.FC<PricingGridProps> = ({
  plans,
  showTitle = true,
  renderAction,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2">
            Flexible Subscription Tiers
          </h2>
          <p className="text-base-content/70">
            Find the optimal plan tailored to your goals.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.slug}
            className={`card bg-base-100 border transition-all duration-200 shadow-sm hover:shadow-md ${
              plan.slug === "pro"
                ? "border-primary border-2 relative"
                : "border-base-300"
            }`}
          >
            {plan.slug === "pro" && (
              <span className="badge badge-primary absolute -top-3 right-4 font-semibold text-xs py-2 px-3">
                POPULAR CHOICE
              </span>
            )}

            <div className="card-body p-8 flex flex-col">
              <h3 className="card-title text-2xl font-bold mb-1">
                {plan.name}
              </h3>
              <p className="text-base-content/70 text-sm min-h-[40px] mb-4">
                {plan.description}
              </p>

              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-black tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-base-content/60 text-sm ml-2">
                  / {plan.interval}
                </span>
              </div>

              <div className="divider my-2" />

              <ul className="space-y-3 my-4 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-base-content/90"
                  >
                    <svg
                      className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="card-actions mt-8">{renderAction(plan)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};