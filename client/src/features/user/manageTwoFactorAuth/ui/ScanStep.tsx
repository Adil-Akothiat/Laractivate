import { ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTfaStepperContext } from '../model/TfaStepperContext';

export const ScanStep = () => {
  const { setStep, qrUrl } = useTfaStepperContext();

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="bg-primary/10 text-primary rounded-full p-4">
        <ShieldCheck size={28} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-base-content">Scan the QR Code</h2>
        <p className="text-sm text-base-content/50 mt-1">
          Open your authenticator app (Google Authenticator, Authy, etc.) and scan this code.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-base-300">
        {qrUrl ? (
          <QRCodeSVG value={qrUrl} size={180} />
        ) : (
          <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-base-content/30">
            Missing QR Stream
          </div>
        )}
      </div>

      <button onClick={() => setStep('verify')} className="btn btn-primary w-full" disabled={!qrUrl}>
        Next — Enter Code
      </button>
    </div>
  );
}