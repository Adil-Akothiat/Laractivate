import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Alert, Button } from "@/components";
import { useBillingMutations } from "../../hooks/api/useBillingMutations";

type PaymentMethodFormProps = {
    onSuccess: () => void;
};

export default function PaymentMethodForm({ onSuccess }: PaymentMethodFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [stripeError, setStripeError] = useState<string | null>(null);

    // Get TanStack mutation
    const { usePaymentMethod } = useBillingMutations();
    const { addPaymentMethod } = usePaymentMethod();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStripeError(null);

        if (!stripe || !elements) return;

        // Step 1: Confirm SetupIntent with Stripe
        const { error, setupIntent } = await stripe.confirmSetup({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setStripeError(error.message ?? "Failed to process card details.");
            return;
        }

        // Step 2: Pass PaymentMethod ID to TanStack Mutation
        if (setupIntent?.payment_method) {
            const paymentMethodId = typeof setupIntent.payment_method === "string" 
                ? setupIntent.payment_method 
                : setupIntent.payment_method.id;

            addPaymentMethod.mutate(
                { payment_method_id: paymentMethodId},
                {
                    onSuccess: () => {
                        onSuccess(); // Close modal or refresh list
                    },
                }
            );
        }
    };

    // const isSubmitting = stripe ? false : true; // Managed via mutation or stripe readiness

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PaymentElement
                options={{
                    layout: 'tabs',
                    wallets: {
                        applePay: 'never',
                        googlePay: 'never',
                    },
                    terms: {
                        usBankAccount: 'never',
                        card: 'never'
                    },
                }}
            />

            {/* Error Message Display */}
            {(stripeError || addPaymentMethod.isError) && (
                <Alert message={"Failed to save payment method."} variant="error" />
            )}

            <Button 
                type="submit" 
                variant="primary" 
                disabled={!stripe || addPaymentMethod.isPending}
            >
                {addPaymentMethod.isPending ? "Saving…" : "Save card"}
            </Button>
        </form>
    );
}