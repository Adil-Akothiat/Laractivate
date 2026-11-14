import { useState } from "react";
import { Badge, ConfirmModal } from "@/components";
import { ActiveSubscriptionSchema } from "../../types";
import { formatCurrency, formatDate } from "../../utils";
import { useBillingMutations } from "../../hooks/api/useBillingMutations";
import { useToastContext } from "@/app/hooks";

const CustomParagraph = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs md:text-sm text-gray-600 font-semibold">{children}</p>
);

export default function SubscriptionHeader({ sub }: { sub: ActiveSubscriptionSchema }) {
  const { useSubscription } = useBillingMutations();
  const { resume } = useSubscription();
  const { toast } = useToastContext();
  const [openModal, setOpenModal] = useState({
    open: false,
    title: "",
    body: '',
    confirmFn: () => { }
  });

  const closeModalHandler = () => {
    setOpenModal({
      open: false,
      title: '',
      body: '',
      confirmFn: () => { }
    });
  }
  
  const handleResume = () => {
      resume.mutate(undefined, {
        onSuccess: () => {
          toast.success("You have been resubscribed into your subscription.");
          closeModalHandler();
        },
        onError: (err: Error) => {
          toast.error(err.message ?? "Something went wrong while resubscribing into your subscription.");
          closeModalHandler();
        },
      });
    };
  
  const resubscribeHandler = () => {
    setOpenModal({
      open: true,
      title: `Keep ${sub.plan.name} active?`,
      body: `Do you want to keep your current plan (${sub.plan.name}) active with auto-renewal?`,
      confirmFn: handleResume,
    })
  };
  
  return (
    <div className="grid grid-cols-1 gap-1">
      {
        openModal.open && (
          <ConfirmModal
            isOpen={openModal.open}
            title={openModal.title}
            message={openModal.body}
            onConfirm={openModal.confirmFn}
            onCancel={closeModalHandler}
            variant="error"
            loading={resume.isPending}
          />
        )
      }
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold capitalize">{sub?.plan.name}</h3>
          <Badge variant="info" size="sm" outline={true}>Annual</Badge>
        </div>
      </div>
      <div>
        {
          (sub.next_invoice && !sub.pending_downgrade) && (
            <CustomParagraph>
              <span className="underline">Next invoice: { formatCurrency(sub.next_invoice.amount, sub.next_invoice.currency) }</span> on {formatDate(sub.next_invoice.billing_at)}
            </CustomParagraph>
          )
        }
        {sub.can_resume && sub.ends_at && (
          <CustomParagraph>
            Your subscription is set to cancel and will remain active until {formatDate(
              sub.ends_at
            )}.
            <button className="text-blue-400 text-sm underline cursor-pointer font-semibold" onClick={resubscribeHandler}>
              Resubscribe
            </button>
          </CustomParagraph>
        )}
        {
          (sub.pending_downgrade && sub.next_invoice) &&  (
            <CustomParagraph>
              <span className="underline">Next invoice: { formatCurrency(sub.next_invoice.amount, sub.next_invoice.currency) }</span> on {formatDate(sub.next_invoice.billing_at)} (Downgrading to {sub.pending_downgrade.plan_name})
            </CustomParagraph>
          )
        }
      </div>
    </div>
  );
}