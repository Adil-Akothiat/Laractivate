import { useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import OtpInput from './OtpInput';
import { getErrorsMessages } from '../../../../../app/utils';
import { Alert } from '../../../../../components';

interface Props {
  onVerify:   (otp: string) => void;
  isPending:  boolean;
  isError:    boolean;
  isInvalid:  boolean;  // server returned isValid: false
  error:      unknown;
  onBack:     () => void;
}

const StepVerify = ({ onVerify, isPending, isError, isInvalid, error, onBack }: Props) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) onVerify(code);
  };

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

      {isError &&
        getErrorsMessages(error).map((msg: string, i: number) => (
          <Alert key={i} variant="error" message={msg} />
        ))}

      <OtpInput value={code} onChange={setCode} disabled={isPending} />

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isPending || code.length < 6}
      >
        {isPending ? <span className="loading loading-xs" /> : null}
        Verify & Activate
      </button>

      <button type="button" onClick={onBack} className="btn btn-ghost btn-sm gap-1">
        <RefreshCw size={13} /> Re-scan QR Code
      </button>
    </form>
  );
};

export default StepVerify;