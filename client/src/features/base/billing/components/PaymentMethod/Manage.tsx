import ConfirmModal from "@/components/Modals/ConfirmModal";
import Modal from "@/components/Modals/Modal";
import { useState } from "react";
import PaymentMethodCards, { BRAND_LABEL } from "./PaymentMethodsList";
import { PaymentMethodSchema } from "../../types";
import AddPaymentMethod from "./AddPaymentMethod";
import { useBillingMutations } from "../../hooks/api/useBillingMutations";
import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr } from "@/app/utils";

export default function ManagePaymentMethod() {
  const [addOpen, setAddOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodSchema | null>(null);
  const { usePaymentMethod } = useBillingMutations();
  const { deletedPaymentMethod, setAsDefaultPaymentMethod } = usePaymentMethod();
  const { toast } = useToastContext();

  const handleSetDefault = (id: string) => {
    setAsDefaultPaymentMethod.mutate(id, {
       onSuccess: (res)=> {
        setPaymentMethod(null);
        toast.success(res?.message||'');
      },
      onError: (error:any )=> {
        setPaymentMethod(null);
        toast.error(getErrorsMessagesStr(error));
      }
    })
  };

  const handleRemove = (pm: PaymentMethodSchema) => {
    setPaymentMethod(pm);
  };

  const handleConfirmRemove = () => {
    if(!paymentMethod) return;
    deletedPaymentMethod.mutate(paymentMethod.id,{
      onSuccess: (res)=> {
        setPaymentMethod(null);
        toast.success(res?.message||'');
      },
      onError: (res)=> {
        setPaymentMethod(null);
        toast.error(res?.message||'')
      }
    });
  };

  return (
    <>
      <PaymentMethodCards
        onRemove={handleRemove}
        onSetDefault={handleSetDefault}
        addOpen={() => setAddOpen(true)}
      />
      {/* Card entry form goes here — e.g. Stripe PaymentElement mounted on open. */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add payment method" size="sm">
        <AddPaymentMethod onSuccess={() => setAddOpen(false)} />
      </Modal>

      <ConfirmModal
        isOpen={paymentMethod !== null}
        onCancel={() => setPaymentMethod(null)}
        onConfirm={handleConfirmRemove}
        title="Remove payment method?"
        message={
          paymentMethod
            ? `This will remove ${BRAND_LABEL[paymentMethod.brand] ?? paymentMethod.brand} •••• ${paymentMethod.last4} from your account.`
            : ""
        }
        confirmLabel="Remove"
        variant="error"
      loading={deletedPaymentMethod.isPending}
      />
    </>
  );
}