import { Card } from "@/components";
import { ActiveSubscriptionSchema } from "../../types";
import ManageSubscription from "./Manage";
import SubscriptionHeader from "./SubscriptionHeader";

interface SubscriptionDetailsProps {
  sub: ActiveSubscriptionSchema;
}

export default function SubscriptionDetails({ sub }: SubscriptionDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between border-b border-gray-200 pb-3 gap-y-2">
          <SubscriptionHeader sub={sub} />
          <ManageSubscription sub={sub} />
        </div>
        <div className="text-center py-3">
          Content About Current Plan
        </div>
      </Card>
    </div>
  );
}
