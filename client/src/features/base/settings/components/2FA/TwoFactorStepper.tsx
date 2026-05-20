import { useState } from "react";
import StepIntro from "./StepIntro";
import StepScan from "./StepScan";
import StepVerify from "./StepVerify";
import StepSuccess from "./StepSuccess";
import { Modal } from "@/components";
import { useSettingsMutations } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import type { UserSchema } from "@/features/base/shared";

type ModalStep = "idle" | "scan" | "verify" | "success";

interface TwoFactorStepperProps {
  user: UserSchema | undefined;
}

export default function TwoFactorStepper({ user }: TwoFactorStepperProps) {
  const queryClient = useQueryClient();
  const { tfa } = useSettingsMutations();

  const [modalStep, setModalStep] = useState<ModalStep>("idle");
  const [qrUrl, setQrUrl] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [freshCodes, setFreshCodes] = useState<string[]>([]);
  const [modalDisableOpened, setModalDisableOpened] = useState<boolean>(false);

  // Directly derive state status from server cache prop to avoid duplicate stale state traps
  const isEnabled = !!user?.two_factor_enabled;

  // Step 1 — Initialize flow & capture QR signature payload
  const handleInit = () => {
    tfa.init.mutate(undefined, {
      onSuccess: (res) => {
        // Access nested response array data payload matching base resource formatting
        setQrUrl(res.data.data.tfaQrcode);
        setModalStep("scan");
      },
    });
  };

  // Step 3 — Verify OTP Token
  const handleEnable = (otp: string) => {
    const sanitized = otp.replace(/\D/g, "").trim();
    if (sanitized.length !== 6) return;

    setIsInvalid(false);
    tfa.enable.mutate(
      { otp: sanitized },
      {
        onSuccess: (res) => {
          setFreshCodes(res.data.data.recoveryCodes);
          setModalStep("success");
          
          // Force profile cache invalidation to hydrate user schema properties seamlessly
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: () => {
          setIsInvalid(true);
        },
      }
    );
  };

  const handleCloseModal = () => {
    setModalStep("idle");
    setFreshCodes([]);
    setQrUrl("");
    setIsInvalid(false);
    tfa.enable.reset();
  };

  const handleDisable2FA = (password: string) => {
    tfa.disable.mutate(
      { password },
      {
        onSuccess: () => {
          setModalDisableOpened(false);
          // Drop stale authorization layouts
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
      }
    );
  };

  return (
    <>
      <StepIntro
        isEnabled={isEnabled}
        enable2fa={{
          tfaInitApi: handleInit,
          isPending: tfa.init.isPending,
        }}
        disable2fa={{
          disableApi: handleDisable2FA,
          isPending: tfa.disable.isPending,
          open: modalDisableOpened,
          setOpen: setModalDisableOpened,
        }}
        tfaRecoveryCodes={{
          recoveryCodes: user?.two_factor_recovery_codes || [],
          isPending: tfa.regenerateRecoveryCodes.isPending,
          regenerate: () =>
            tfa.regenerateRecoveryCodes.mutate(undefined, {
              onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
            }),
        }}
      />

      <Modal isOpen={modalStep !== "idle"} onClose={handleCloseModal}>
        {(modalStep === "scan" || modalStep === "verify") && (
          <ul className="steps steps-horizontal w-full mb-8 text-xs">
            <li className="step step-primary">Scan QR</li>
            <li className={`step ${modalStep === "verify" ? "step-primary" : ""}`}>
              Verify
            </li>
          </ul>
        )}

        {modalStep === "scan" && (
          <StepScan qrUrl={qrUrl} onNext={() => setModalStep("verify")} />
        )}

        {modalStep === "verify" && (
          <StepVerify
            onVerify={handleEnable}
            isPending={tfa.enable.isPending}
            isError={tfa.enable.isError}
            isInvalid={isInvalid}
            error={tfa.enable.error}
            onBack={() => {
              tfa.enable.reset();
              setIsInvalid(false);
              setModalStep("scan");
            }}
          />
        )}

        {modalStep === "success" && (
          <StepSuccess recoveryCodes={freshCodes} closeHandler={handleCloseModal} />
        )}
      </Modal>
    </>
  );
}