import { Badge, Button, Dropdown, DropdownItem } from "@/components";
import { PaymentMethodSchema } from "../../types";
import { BRAND_LABEL } from "./PaymentMethodsList";

type PaymentMethodCardProps = {
  paymentMethod: PaymentMethodSchema;
  pmLength: number;
  onSetDefault: (id: string) => void;
  onRemove: (pm: PaymentMethodSchema) => void;
}

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

export default function PaymentMethodCard({ paymentMethod, pmLength, onSetDefault, onRemove }: PaymentMethodCardProps) {
  const onlyCard = pmLength <= 1;
  const items: DropdownItem[] = [
    {
      key: "default",
      label: "Set as default",
      onClick: () => onSetDefault(paymentMethod.id),
    },
    {
      key: "remove",
      label: "Remove",
      className: "text-error",
      // Can't remove your only card — must add a replacement first.
      disabled: paymentMethod.is_default && onlyCard,
      onClick: () => onRemove(paymentMethod),
    }
  ];


  const expiring = isExpiringSoon(paymentMethod.exp_month, paymentMethod.exp_year);
  return (
    <li
      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
    >
      <div className="flex items-center gap-3">
        <BrandIcon brand={paymentMethod.brand} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {BRAND_LABEL[paymentMethod.brand] ?? paymentMethod.brand} •••• {paymentMethod.last4}
            </span>
            {paymentMethod.is_default && (
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
            Expires {String(paymentMethod.exp_month).padStart(2, "0")}/{paymentMethod.exp_year}
          </p>
        </div>
      </div>

      {paymentMethod.is_default ? null : <Dropdown
        trigger={
          <Button variant="ghost" size="sm" circle aria-label="Payment method actions">
            ⋮
          </Button>
        }
        items={items}
      />
      }
    </li>
  );
}