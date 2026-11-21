import { getErrorsMessages } from "@/app/utils";
import { Alert, Button } from "@/components";
import OtpInput from "@/components/ui/forms/OtpInput";
import { UserSchema } from "@/features/shared";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { SubmitEventHandler, useState } from "react";
import { useEnableTfa } from "../api";
import { useTfaContext } from "../model/useTfaContext";

export default function VerifyAndEnableTfa() {
  const { mutate, isPending, isError, error, reset } = useEnableTfa();
  const { dispatch } = useTfaContext();
  const [validOtp, setValidOtp] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const handleEnable = (otp: string) => {
    const sanitized = otp.replace(/\D/g, "").trim();
    if (sanitized.length !== 6) return;

    setValidOtp(true);
    mutate(
      { otp: sanitized },
      {
        onSuccess: (res) => {
          dispatch({ type: "verify", payload: { recoveryCodes: res.data.data.recoveryCodes } });
          queryClient.setQueryData<UserSchema>(['user'], (oldUser) => {
            if (!oldUser) return oldUser;
            return {
              ...oldUser,
              two_factor_recovery_codes: res.data.data.recoveryCodes ?? []
            }
          })
          reset();
        },
        onError: () => {
          setValidOtp(false);
        },
      }
    );
  };

  const [code, setCode] = useState<string>("");
  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      handleEnable(code);
    }
  };

  const rescanHandler = () => {
    setCode("");
    dispatch({ type: "back-to-scan" });
  }

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

      {!validOtp && (
        <div className="alert alert-error w-full text-sm py-2">
          Invalid code. Please try again.
        </div>
      )}

      {isError &&
        getErrorsMessages(error).map((msg: string, i: number) => (
          <Alert key={i} variant="error" message={msg} />
        ))}

      <OtpInput value={code} onChange={setCode} disabled={isPending} />
      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        disabled={code.length < 6}
      >
        {isPending && <span className="loading loading-xs" />}
        Verify & Activate
      </Button>

      <Button type="button" onClick={rescanHandler} variant="ghost" size="sm" disabled={isPending}>
        <RefreshCw size={13} /> Re-scan QR Code
      </Button>
    </form>
  );
}