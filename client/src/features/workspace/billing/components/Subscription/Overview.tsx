import { DataLoader } from "@/components/Loaders/DataLoader";
import { EmptyState, Button } from "@/components";
import { ShieldAlert } from "lucide-react";
import { useSubscriptionQuery } from "../../hooks/api/useBillingQueries";
import SubscriptionDetails from "./Details";

function NoSubscription() {
  return (
    <EmptyState
      icon={<ShieldAlert size={40} />}
      title="No active subscription"
      description="You don't currently have an active plan. Choose a plan to unlock all features."
      action={
        <Button variant="primary" size="sm">
          View plans
        </Button>
      }
    />
  );
}

export default function SubscriptionOverview() {
  const query = useSubscriptionQuery();

  return (
    <DataLoader query={query}>
      {
        (data) => {
          const sub = data.data;
          if(!sub) return <NoSubscription />;
          return <SubscriptionDetails sub={sub} />;
        }
      }
    </DataLoader>
  );
}