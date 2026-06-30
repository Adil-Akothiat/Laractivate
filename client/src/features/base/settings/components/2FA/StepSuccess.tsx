import { CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";
import { Button } from "@/components";
import { useState } from "react";

type StepSuccessProps = {
  closeHandler: () => void;
  recoveryCodes: string[];
};

const StepSuccess = ({ closeHandler, recoveryCodes }: StepSuccessProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

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

      {recoveryCodes.length > 0 && (
        <div className="w-full text-left">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-base-content">
              Save Your Recovery Codes
            </p>
            <button
              onClick={copyAll}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {copiedAll ? (
                <><Check size={12} /> Copied!</>
              ) : (
                <><Copy size={12} /> Copy all</>
              )}
            </button>
          </div>
          <p className="text-xs text-base-content/50 mb-3">
            These codes let you access your account if you lose your authenticator. Each code works only once — store them somewhere safe before closing this window.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((code, index) => (
              <button
                key={index}
                onClick={() => copyCode(code, index)}
                className="flex items-center justify-between bg-base-200 hover:bg-base-300 rounded-md px-3 py-2 font-mono text-xs text-base-content transition-colors group"
              >
                <span>{code}</span>
                {copiedIndex === index ? (
                  <Check size={12} className="text-success shrink-0" />
                ) : (
                  <Copy size={12} className="text-base-content/30 group-hover:text-base-content/60 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button variant="neutral" className="w-full" onClick={closeHandler}>
        Done
      </Button>
    </div>
  );
};

export default StepSuccess;