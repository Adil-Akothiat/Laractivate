import { Badge, Button } from "@/components";
import { useGetUser } from "@/entities/user";
import Disable2FA from "@/features/user/manageTwoFactorAuth/ui/Disable2FA";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useDisableTfa, useInitTfa } from "../api";
import { useTfaContext } from "../model/useTfaContext";
import { TfaRecoveryCodes } from "./TfaRecoveryCodes";
import TwoFactorGuide from "./TwoFactorGuide";

export const InitializeStep = () => {
  const { data: user } = useGetUser();
  const isEnabled = user?.two_factor_enabled ?? false;

  const init = useInitTfa();
  const disable = useDisableTfa();
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const { dispatch } = useTfaContext();
  const handleInit = () => {
    init.mutate(undefined, {
      onSuccess: (res) => {
        dispatch({ type: "init", payload: { qrUrl: res.data.data.tfaQrcode } });
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
        <div className="grid md:grid-cols-[80%_20%] gap-x-4 gap-y-3">
          <div className="order-1 md:order-2">
            <TfaRecoveryCodes />
          </div>
          <div className="md:order-2 flex justify-between md:block md:ml-auto">
            <p className="order-2 md:order-1 text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">
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