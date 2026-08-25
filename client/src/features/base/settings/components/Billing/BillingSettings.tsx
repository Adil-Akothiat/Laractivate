import { CreditCard, Receipt } from "lucide-react";
import InvoiceHistory from "./InvoiceHistory";
import SettingsContainer from "../Shared/SettingsContainer";
import { Tabs } from "@/components";
import SubscriptionOverview from "@/features/base/billing/components/Subscription/Overview";
import ManagePaymentMethod from "@/features/base/billing/components/PaymentMethod/Manage";

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
    label: "Payment Method",
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