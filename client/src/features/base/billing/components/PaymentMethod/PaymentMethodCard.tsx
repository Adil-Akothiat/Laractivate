import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Dropdown, { type DropdownItem } from "@/components/Dropdown";
import EmptyState from "@/components/EmptyState";
import { PaymentMethodSchema } from "../../types";

export const BRAND_LABEL: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners Club",
  unionpay: "UnionPay",
};

function BrandIcon({ brand }: { brand: string }) {
  return (
    <div className="w-10 h-7 rounded-md border border-base-200 bg-base-100 flex items-center justify-center text-[9px] font-bold uppercase tracking-wide text-base-content/70 shrink-0">
      {brand.slice(0, 4)}
    </div>
  );
}

// Flags a card expiring within ~2 months so users aren't surprised by a failed charge.
function isExpiringSoon(month: number, year: number) {
  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  const diffMonths =
    (expiry.getFullYear() - now.getFullYear()) * 12 + (expiry.getMonth() - now.getMonth());
  return diffMonths <= 2;
}

interface PaymentMethodCardProps {
  paymentMethods: PaymentMethodSchema[];
  onSetDefault: (id: string) => void;
  onRemove: (pm: PaymentMethodSchema) => void;
  onAdd: () => void;
}

export default function PaymentMethodCard({
  paymentMethods,
  onSetDefault,
  onRemove,
  onAdd,
}: PaymentMethodCardProps) {
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
        <Button size="sm" variant="primary" onClick={onAdd}>
          + Add method
        </Button>
      </div>

      <div className="mt-4">
        {!paymentMethods?.length ? (
          <EmptyState
            title="No payment method on file"
            description="Add a card to keep your subscription active."
            action={
              <Button size="sm" variant="primary" onClick={onAdd}>
                Add payment method
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-base-200">
            {[...paymentMethods]
              .sort((a, b) => Number(b.is_default) - Number(a.is_default))
              .map((pm) => {
                const onlyCard = paymentMethods.length <= 1;

                const items: DropdownItem[] = [];
                if (!pm.is_default) {
                  items.push({
                    key: "default",
                    label: "Set as default",
                    onClick: () => onSetDefault(pm.id),
                  });
                }
                items.push({
                  key: "remove",
                  label: "Remove",
                  className: "text-error",
                  // Can't remove your only card — must add a replacement first.
                  disabled: pm.is_default && onlyCard,
                  onClick: () => onRemove(pm),
                });

                const expiring = isExpiringSoon(pm.exp_month, pm.exp_year);

                return (
                  <li
                    key={pm.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <BrandIcon brand={pm.brand} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            {BRAND_LABEL[pm.brand] ?? pm.brand} •••• {pm.last4}
                          </span>
                          {pm.is_default && (
                            <Badge variant="primary" size="sm" outline>
                              Default
                            </Badge>
                          )}
                          {expiring && (
                            <Badge variant="warning" size="sm" outline>
                              Expiring soon
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-base-content/50 mt-0.5">
                          Expires {String(pm.exp_month).padStart(2, "0")}/{pm.exp_year}
                        </p>
                      </div>
                    </div>

                    <Dropdown
                      trigger={
                        <Button variant="ghost" size="sm" circle aria-label="Payment method actions">
                          ⋮
                        </Button>
                      }
                      items={items}
                    />
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </Card>
  );
}