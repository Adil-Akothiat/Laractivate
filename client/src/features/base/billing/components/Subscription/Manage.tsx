import { useState } from "react";
import { Button, ConfirmModal, Dropdown } from "@/components";
// import { Ban, PlayCircle, ArrowRightLeft, RotateCcw } from "lucide-react";
import { ActiveSubscriptionSchema } from "../../types";
import { useBillingMutations } from "../../hooks/api/useBillingMutations";
import { formatCurrency, formatDate } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@/app/hooks";
import { Ellipsis } from "lucide-react";

interface ManageProps {
  sub: ActiveSubscriptionSchema;
}

// type ConfirmKind = "cancel" | "resume" | "cancel_pending_downgrade" | null;

export default function Manage({ sub }: ManageProps) {
  const { useSubscription } = useBillingMutations();
  const { cancel, cancelScheduledSubscription } = useSubscription();
  const { toast } = useToastContext();
  const navigate = useNavigate();

  const handleCancel = () => {
    cancel.mutate(undefined, {
      onSuccess: () => {
        toast.success("Your subscription will be canceled at the end of the billing period.");
        closeModalHandler();
      },
      onError: (err: Error) => {
        toast.error(err.message ?? "Something went wrong while canceling your subscription.");
        closeModalHandler();
      },
    });
  };

  const handleCancelPendingDowngrade = () => {
    cancelScheduledSubscription.mutate(undefined, {
      onSuccess: () => {
        toast.success("Your scheduled plan change has been canceled. You'll stay on your current plan.");
        closeModalHandler();
      },
      onError: (err: Error) => {
        toast.error(err.message ?? "Something went wrong while canceling the scheduled change.");
        closeModalHandler();
      },
    });
  };


  // Three mutually exclusive states, in priority order:
  // 1. A scheduled downgrade exists — the only cancel/resume-shaped action
  //    available is cancelling *that* schedule (can_cancel/can_resume are
  //    both false here, which is expected, not an error state).
  // 2. Normal cancel/resume, driven directly by the backend flags.
  // 3. Nothing to manage — just the "view plans" link, if provided.
  const hasPendingDowngrade = !!sub.pending_downgrade;
  const isCancelable = sub.can_cancel;
  const [openModal, setOpenModal] = useState({
    open: false,
    title: "",
    body: '',
    confirmFn: () => { }
  });
  
  
  // if (!sub.can_cancel && !sub.can_resume && !hasPendingDowngrade && !onViewPlans) return null;
  const cancelPlanHandler = (option:string="1") => {
    if (isCancelable && !hasPendingDowngrade && sub.next_invoice) {
      setOpenModal({
        open: true,
        title: 'Cancel Subscription',
        body: `Your ${sub.plan.name} will remain active with full feature access until ${formatDate(sub.next_invoice.billing_at)}. After this date, your subscription will end, and you will no longer be charged.`,
        confirmFn: handleCancel
      });
    } else {
      if (hasPendingDowngrade && sub.next_invoice) {

      // user can choose between three options:
      // -1 cancel the scheduled subscription keep current plan
      // -2 cancel the entire subscription
      // const result = prompt('choose 1 or 2 or 3:\n 1- Cancel scheduled downgrade \n 2- Cancel entire subscription \n 3- Close modal');
      if (option === '1') {
        setOpenModal({
          open: true,
          title: 'Cancel Scheduled Downgrade',
          body: `You will stay on the ${sub.plan.name}. Your subscription will automatically renew at ${formatCurrency(sub.next_invoice.amount, sub.next_invoice.currency)}/year on ${formatDate(sub.next_invoice.billing_at)}`,
          confirmFn: handleCancelPendingDowngrade
        });
      } else {
          setOpenModal({
            open: true,
            title: 'Cancel Entire Subscription',
            body: `Choosing this stops auto-renewal. You will retain ${sub.plan.name} features until ${formatDate(sub.next_invoice.billing_at)}, when your subscription will safely expire with no further charges.`,
            confirmFn: ()=> {
              cancelScheduledSubscription.mutate(undefined, {
                onSuccess: () => {
                  handleCancel();
                },
                onError: (error) => {
                  toast.error(error.message ?? 'Something went wrong while canceling your subscription.');
                }

              })
            }
          });
      }
    }
    }
    
  }

  const closeModalHandler = ()=> {
    setOpenModal({
      open: false,
      title: '',
      body: '',
      confirmFn: () => { }
    });
  }

  const dropdownItems = [];
  
  if(hasPendingDowngrade){
    dropdownItems.push({
      key: "cancel_pending_downgrade",
      label: "Cancel pending downgrade",
      onClick: ()=> cancelPlanHandler("1"),
      className: "text-error"
    });
    dropdownItems.push({
      key: "cancel_entire_subscription",
      label: "Cancel entire subscription",
      onClick: ()=> cancelPlanHandler("2"),
      className: "text-error"
    });
  }
// export interface DropdownItem {
//   key: string;
//   label: React.ReactNode;
//   icon?: React.ReactNode;
//   disabled?: boolean;
//   divider?: boolean;
//   onClick?: () => void;
//   className?: string;
// }
  if(isCancelable && !hasPendingDowngrade){
    dropdownItems.push({
      key: "cancel",
      label: "Cancel subscription",
      onClick: cancelPlanHandler,
      disabled: !isCancelable && !hasPendingDowngrade,
      className: "text-error"
    });
  }

  return (
    <div className="w-fit ml-auto">
      <div className="flex flex-wrap items-center gap-x-2">
        <Button outline={true} variant="neutral" size="sm" onClick={()=> navigate("/dashboard/pricing")}>Change plan</Button>
        {
          (isCancelable || hasPendingDowngrade) && (
            <Dropdown
              trigger={<Button outline={true} variant="neutral" size="sm"><Ellipsis size={12} /></Button>}
              items={dropdownItems}
            />
          )
        }
        {
          openModal.open && (
            <ConfirmModal 
              isOpen={openModal.open}
              title={openModal.title}
              message={openModal.body}
              onConfirm={openModal.confirmFn}
              onCancel={closeModalHandler}
              variant="error"
              loading={cancel.isPending || cancelScheduledSubscription.isPending}
            />
          )
        }
      </div>
    </div>
  );
}