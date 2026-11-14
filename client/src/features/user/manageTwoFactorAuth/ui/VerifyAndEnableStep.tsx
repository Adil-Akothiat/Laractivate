import { getErrorsMessages } from "@/app/utils";
import { Alert, Button } from "@/components";
import OtpInput from "@/features/shared/components/2FA/OtpInput";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { useVerifyAndEnableTfa } from "../model";
import { useTfaStepperContext } from "../model/TfaStepperContext";

export default function VerifyAndEnableTfa() {
  const { isInvalid, onBack } = useTfaStepperContext();
  const { handleSubmit, enable, code, setCode } = useVerifyAndEnableTfa();
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
      <div className="bg-primary/10 text-primary rounded-full p-4">
        <ShieldCheck size={28} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-base-content">Enter Verification Code</h2>
        <p className="text-sm text-base-content/50 mt-1">
          Enter the 6-digit code from your authenticator app to confirm setup.
        </p>
      </div>

      {isInvalid && (
        <div className="alert alert-error w-full text-sm py-2">
          Invalid code. Please try again.
        </div>
      )}

      {enable.isError &&
        getErrorsMessages(enable.error).map((msg: string, i: number) => (
          <Alert key={i} variant="error" message={msg} />
        ))}

      <OtpInput value={code} onChange={setCode} disabled={enable.isPending} />

      <Button
        type="submit"
        variant="primary"
        loading={enable.isPending}
        disabled={code.length < 6}
      >
        {enable.isPending && <span className="loading loading-xs" />}
        Verify & Activate
      </Button>

      <Button type="button" onClick={() => onBack(enable.reset)} variant="ghost" size="sm" disabled={enable.isPending}>
        <RefreshCw size={13} /> Re-scan QR Code
      </Button>
    </form>
  );
}