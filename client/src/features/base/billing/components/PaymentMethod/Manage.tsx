"use client";

import { useState } from "react";
import { DataLoader } from "@/components/Loaders/DataLoader";
import Modal from "@/components/Modals/Modal";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import PaymentMethodCard, { BRAND_LABEL } from "./PaymentMethodCard";
import {
  usePaymentMethodsQuery,
  // Not in the component zip — add these to useBillingQueries following the
  // same pattern as usePaymentMethodsQuery. Rename here if yours differ.
//   useSetDefaultPaymentMethodMutation,
//   useDeletePaymentMethodMutation,
} from "../../hooks/api/useBillingQueries";
import { PaymentMethodSchema } from "../../types";

export default function ManagePaymentMethod() {
  const query = usePaymentMethodsQuery();
//   const setDefaultMutation = useSetDefaultPaymentMethodMutation();
//   const deleteMutation = useDeletePaymentMethodMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PaymentMethodSchema | null>(null);

  const handleSetDefault = (id: string) => {
    // setDefaultMutation.mutate(id);
  };

  const handleRemove = (pm: PaymentMethodSchema) => {
    setPendingDelete(pm);
  };

  const handleConfirmRemove = () => {
    if (!pendingDelete) return;
    // deleteMutation.mutate(pendingDelete.id, {
    //   onSuccess: () => setPendingDelete(null),
    // });
  };

  return (
    <>
      <DataLoader query={query}>
        {(paymentMethods:PaymentMethodSchema[]) => 
            {
                console.log(paymentMethods);
                return (
                    <PaymentMethodCard
                        paymentMethods={paymentMethods}
                        onSetDefault={handleSetDefault}
                        onRemove={handleRemove}
                        onAdd={() => setAddOpen(true)}
                    />
                );
            }
        }
      </DataLoader>

      {/* Card entry form goes here — e.g. Stripe PaymentElement mounted on open. */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add payment method"
        size="sm"
      >
        <div className="text-sm text-base-content/60">
          Mount your card element here (Stripe PaymentElement, etc.).
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmRemove}
        title="Remove payment method?"
        message={
          pendingDelete
            ? `This will remove ${BRAND_LABEL[pendingDelete.brand] ?? pendingDelete.brand} •••• ${pendingDelete.last4} from your account.`
            : ""
        }
        confirmLabel="Remove"
        variant="error"
        // loading={deleteMutation.isPending}
      />
    </>
  );
}