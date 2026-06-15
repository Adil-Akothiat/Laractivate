import { useNavigate } from "react-router-dom";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { usePricingQuery } from "@/features/base/billing/hooks/api/useBillingQueries";
import { PricingGrid } from "./PricingGrid";

export default function PublicPricingPage() {
  const navigate = useNavigate();
  const query = usePricingQuery();

  return (
    <DataLoader query={query}>
      {(data) => {
        return (
          <PricingGrid
            plans={data}
            renderAction={(plan) => (
              <button
                className={`btn btn-block font-bold ${
                  plan.slug === "pro" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() =>
                  navigate("/login", { state: { redirectPlan: plan.slug } })
                }
              >
                Get Started with {plan.name}
              </button>
            )}
          />
        );
      }}
    </DataLoader>
  );
}