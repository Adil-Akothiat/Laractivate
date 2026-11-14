import { Tabs } from "@/components";
import ManagePaymentMethod from "@/features/workspace/billing/components/PaymentMethod/Manage";
import SubscriptionOverview from "@/features/workspace/billing/components/Subscription/Overview";
import { CreditCard, Receipt } from "lucide-react";
import SettingsContainer from "../../../../pages/user/settings/layouts/SettingsContainer";
import InvoiceHistory from "./InvoiceHistory";

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
  {
    key: "payment-method",
    label: "Payment Methods",
    icon: <Receipt size={14} />,
    content: <ManagePaymentMethod />,
  },
];

export default function BillingSettings() {
  return (
    <SettingsContainer settingsType="billing">
      <Tabs tabs={tabs} variant="bordered" size="sm" />
    </SettingsContainer>
  );
}