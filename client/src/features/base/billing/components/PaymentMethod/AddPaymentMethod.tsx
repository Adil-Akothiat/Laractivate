import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSetupPaymentMethodIntent } from "../../hooks/api/useBillingQueries";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { PaymentMethodIntentSchema } from "../../types";
import PaymentMethodForm from "./PaymentMethodForm";

export const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_KEY!);

type AddPaymentMethodProps = {
  onSuccess: ()=> void;
}

export default function AddPaymentMethod({ onSuccess }: AddPaymentMethodProps) {
  const query = useSetupPaymentMethodIntent();

  return (
    <DataLoader query={query}>
      {
        (data: PaymentMethodIntentSchema) => {
          return (
            <Elements
              key={data.client_secret}
              stripe={stripePromise}
              options={{ clientSecret: data.client_secret }}
            >
              <PaymentMethodForm onSuccess={onSuccess} />
            </Elements>
          );
        }
      }
    </DataLoader>
  );
}