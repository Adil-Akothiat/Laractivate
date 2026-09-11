import { Alert, Button } from "@/components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useBillingMutations } from "../../hooks/api/useBillingMutations";

type PaymentMethodFormProps = {
    clientSecret:string;
    onSuccess: () => void;
};

export default function PaymentMethodForm({ clientSecret, onSuccess }: PaymentMethodFormProps) {
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

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setStripeError("Card element not found.");
            return;
        }

        // Step 1: Confirm SetupIntent with CardElement
        const { error, setupIntent } = await stripe.confirmCardSetup(
            clientSecret, // You'll need to pass this as a prop
            {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        // Add any billing details if needed
                        // name: 'Customer Name',
                        // email: 'customer@example.com',
                    }
                }
            }
        );

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
                { payment_method_id: paymentMethodId },
                {
                    onSuccess: () => {
                        onSuccess(); // Close modal or refresh list
                    },
                }
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CardElement />
            {/* Error Message Display */}
            {(stripeError || addPaymentMethod.isError) && (
                <Alert message={"Failed to save payment method."} variant="error" />
            )}

            <Button
                type="submit"
                variant="primary"
                loading={!stripe || addPaymentMethod.isPending}
            >
                Save card
            </Button>
        </form>
    );
}