import { EmptyState } from "@/components";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { usePaymentMethodsQuery } from "../../hooks/api/useBillingQueries";
import { PaymentMethodSchema } from "../../types";
import PaymentMethodCard from "./PaymentMethodCard";

export const BRAND_LABEL: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners Club",
  unionpay: "UnionPay",
};

interface PaymentMethodsListProps {
  onSetDefault: (id: string) => void;
  onRemove: (pm: PaymentMethodSchema) => void;
  addOpen: () => void;
}

export default function PaymentMethodsList({
  onSetDefault,
  onRemove,
  addOpen
}: PaymentMethodsListProps) {
  const query = usePaymentMethodsQuery();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="card-title">Payment methods</h2>
          <p className="text-base-content/60 text-sm mt-0.5">
            Charges use your default method. Add a backup so a declined card doesn&apos;t
            interrupt billing.
          </p>
        </div>
        <Button size="sm" variant="primary" onClick={addOpen}>
          + Add method
        </Button>
      </div>
      <DataLoader query={query}>
        {(paymentMethods) => {
          return paymentMethods.length === 0 ? (
            <EmptyState
              title="No payment method on file"
              description="Add a card to keep your subscription active."
              action={
                <Button size="sm" variant="primary" onClick={addOpen}>
                  Add payment method
                </Button>
              }
            />
          ) : (
            <div className="mt-4">
              <ul className="flex flex-col divide-y divide-base-200">
                {[...paymentMethods]
                  .sort((a, b) => Number(b.is_default) - Number(a.is_default))
                  .map((pm) => (
                    <PaymentMethodCard
                      key={pm.id}
                      paymentMethod={pm}
                      pmLength={paymentMethods.length}
                      onSetDefault={onSetDefault}
                      onRemove={onRemove}
                    />
                  ))}
              </ul>
            </div>

          );
        }
        }
      </DataLoader>
    </Card>
  );
}