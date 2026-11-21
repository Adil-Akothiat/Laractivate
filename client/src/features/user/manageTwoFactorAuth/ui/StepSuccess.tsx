import { Button } from "@/components";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useTfaContext } from "../model/useTfaContext";
import { TfaRecoveryCodes } from "./TfaRecoveryCodes";

const StepSuccess = () => {
  const { dispatch } = useTfaContext();
  const closeModalHandler = () => {
    dispatch({ type: "idle" });
  }

  return (
    <div className="flex flex-col items-center text-center gap-5">
      <div className="bg-success/10 text-success rounded-full p-5">
        <CheckCircle2 size={36} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-base-content">
          Two-Factor Authentication Enabled
        </h2>
        <p className="text-sm text-base-content/50 mt-1 max-w-sm">
          Your account is now protected. You'll be asked for a verification code each time you sign in.
        </p>
      </div>
      <div className="badge badge-success gap-1 px-4 py-3 text-sm">
        <ShieldCheck size={14} /> Active
      </div>
      <TfaRecoveryCodes />
      <Button variant="neutral" className="w-full" onClick={closeModalHandler}>
        Done
      </Button>
    </div>
  );
};

export default StepSuccess;