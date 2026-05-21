import Disable2FA, { type Disable2FAProps } from "../../../shared/components/2FA/Disable2FA";
import type { TFRCProps } from "./TwoFactorRecoveryCodes";
import Enable2FA, { type Enable2FAProps } from "./Enable2FA";
import TwoFactorRecoveryCodes from "./TwoFactorRecoveryCodes";
import TwoFactorGuide from "./TwoFactorGuide";
import { Badge } from "@/components";

interface Props {
  disable2fa: Disable2FAProps;
  enable2fa: Enable2FAProps;
  tfaRecoveryCodes: TFRCProps;
  isEnabled: boolean;
}

const StepIntro = ({ disable2fa, enable2fa, isEnabled, tfaRecoveryCodes }: Props) => {
  // ── Enabled: Option C — 2-col layout ──────────────────────────────────────
  if (isEnabled) {
    return (
      <div className="space-y-5">
        {/* Header row: guide info + badge */}
        <div className="flex items-start justify-between gap-4">
          <TwoFactorGuide isEnabled={true} />
          <Badge variant="success" outline size="lg" className="shrink-0">
            Enabled
          </Badge>
        </div>

        <div className="h-px bg-base-content/10" />

        {/* 2-col: recovery codes left · manage actions right */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          {/* Left — recovery codes */}
          {tfaRecoveryCodes.recoveryCodes.length > 0 && (
            <TwoFactorRecoveryCodes
              recoveryCodes={tfaRecoveryCodes.recoveryCodes}
              isPending={tfaRecoveryCodes.isPending}
              regenerate={tfaRecoveryCodes.regenerate}
            />
          )}

          {/* Right — manage actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">
              Manage
            </p>
            <Disable2FA
              disableApi={disable2fa.disableApi}
              isPending={disable2fa.isPending}
              open={disable2fa.open}
              setOpen={disable2fa.setOpen}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Disabled: Option B — stacked with status row ───────────────────────────
  return (
    <div className="space-y-5">
      {/* Status row: badge left, subtle hint right */}
      <div className="flex items-center justify-between">
        <Badge variant="error" outline size="lg">
          Disabled
        </Badge>
        <p className="text-xs text-base-content/40">
          Your account is not fully protected
        </p>
      </div>

      <div className="h-px bg-base-content/10" />

      {/* 3-card step grid */}
      <TwoFactorGuide isEnabled={false} />

      {/* <div className="h-px bg-base-content/10" /> */}

      {/* CTA pinned bottom-right */}
      <div className="flex justify-end">
        <Enable2FA
          tfaInitApi={enable2fa.tfaInitApi}
          isPending={enable2fa.isPending}
        />
      </div>
    </div>
  );
};

export default StepIntro;