import { CheckCircle2, QrCode, ShieldCheck, Smartphone } from "lucide-react";

type Props = {
  isEnabled: boolean;
};

export default function TwoFactorGuide({ isEnabled }: Props) {
  if (isEnabled) {
    return (
      <div className="flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-success/10 text-success shrink-0">
          <ShieldCheck size={18} />
        </div>
        <div className="text-xs text-base-content/70 space-y-0.5">
          <p className="font-semibold text-sm text-base-content">
            Your account is fully protected
          </p>
          <p>
            Each login will require a security code from your linked device.
            Keep your backup codes safe in case you lose access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[
        {
          icon: <Smartphone size={16} />,
          title: "Get your app",
          desc: "Authenticator on your phone.",
        },
        {
          icon: <QrCode size={16} />,
          title: "Scan QR code",
          desc: "Pair your profile and device.",
        },
        {
          icon: <CheckCircle2 size={16} />,
          title: "Verify & save",
          desc: "Confirm token, get backup codes.",
        },
      ].map(({ icon, title, desc }) => (
        <div
          key={title}
          className="rounded-2xl border border-base-content/10 bg-base-200/40 p-4 flex flex-col gap-3"
        >
          <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-sm text-base-content">{title}</p>
            <p className="text-xs text-base-content/60 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}