import { Badge, Button } from "@/components";
import Disable2FA from "@/features/shared/components/2FA/Disable2FA";
import { ShieldCheck } from "lucide-react";
import { useDisableTfa, useInitTfa } from "../api";
import { useTfaStepperContext } from "../model/TfaStepperContext";
import TwoFactorGuide from "./TwoFactorGuide";
import TwoFactorRecoveryCodes from "./TwoFactorRecoveryCodes";

interface Props {
  recoveryCodes: string[];
  isEnabled: boolean;
}

export const InitializeStep = ({ recoveryCodes, isEnabled }: Props) => {
  const init = useInitTfa();
  const disable = useDisableTfa();
  const { modalOpened, setModalOpened, setQrUrl, setStep } = useTfaStepperContext();

  const handleInit = () => {
    init.mutate(undefined, {
      onSuccess: (res) => {
        setQrUrl(res.data.data.tfaQrcode);
        setStep("scan");
      }
    })
  }
  const handleDisable2FA = (password: string) => {
    disable.mutate(
      { password },
      {
        onSuccess: () => {
          setModalOpened(false);
        },
      }
    );
  };

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
          {recoveryCodes.length > 0 && (
            <TwoFactorRecoveryCodes
              recoveryCodes={recoveryCodes}
            />
          )}

          {/* Right — manage actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">
              Manage
            </p>
            <Disable2FA
              disableHandler={handleDisable2FA}
              setOpen={() => setModalOpened(true)}
              open={modalOpened}
              isPending={disable.isPending}
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
        <Button
          variant="primary"
          loading={init.isPending}
          loadingText="Initializing..."
          leftIcon={<ShieldCheck size={16} />}
          onClick={handleInit}
        >
          Enable 2FA
        </Button>
      </div>
    </div>
  );
};