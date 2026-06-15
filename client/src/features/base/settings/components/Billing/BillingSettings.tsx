import { CreditCard, Receipt } from "lucide-react";
import InvoiceHistory from "./InvoiceHistory";
import SubscriptionOverview from "./SubscriptionOverview";
import SettingsContainer from "../Shared/SettingsContainer";
import { Tabs } from "@/components";

const tabs = [
  {
    key: "subscription",
    label: "Subscription",
    icon: <CreditCard size={14} />,
    content: <SubscriptionOverview />,
  },
  {
    key: "invoices",
    label: "Invoices",
    icon: <Receipt size={14} />,
    content: <InvoiceHistory />,
  },
];

export default function BillingSettings() {
  return (
    <SettingsContainer settingsType="billing">
      <Tabs tabs={tabs} variant="bordered" size="sm" />
    </SettingsContainer>
  );
}