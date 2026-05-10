import { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import OtpInput from '../../settings/components/2FA/OtpInput';
import { useTwoFactor } from '../../auth/hooks/useTwoFactor';
import { getErrorsMessages } from '../../../../app/utils';
import { Alert } from '../../../../components';

interface Props {
  userId:string|null;
  onSuccess: () => void;
  onCancel:  () => void;
}

const TwoFactorDialog = ({ userId, onSuccess, onCancel }: Props) => {
  const [otp, setOtp]           = useState('');

  const {
    mutate,
    isPending,
    isError,
    error,
    reset,
  } = useTwoFactor.verify();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = otp.replace(/\D/g, '').trim();
    if (sanitized.length !== 6) return;
    reset();
    mutate(
      { otp: sanitized, user_id:userId },
      {
        onSuccess: () => {
          onSuccess();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-sm mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <h3 className="font-semibold text-base-content text-sm">Two-Factor Verification</h3>
          </div>
          <button onClick={onCancel} className="btn btn-ghost btn-sm btn-circle">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 py-6 flex flex-col items-center gap-5">
          <p className="text-sm text-base-content/60 text-center">
            Enter the 6-digit code from your authenticator app to complete sign in.
          </p>
          {isError &&
            getErrorsMessages(error).map((msg: string, i: number) => (
              <Alert key={i} variant="error" message={msg} />
            ))}

          <OtpInput value={otp} onChange={setOtp} disabled={isPending} />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending || otp.replace(/\D/g, '').length < 6}
          >
            {isPending ? <span className="loading loading-xs" /> : null}
            Verify & Sign In
          </button>

          <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm w-full">
            Cancel — Back to Login
          </button>
        </form>

      </div>
    </div>
  );
};

export default TwoFactorDialog;