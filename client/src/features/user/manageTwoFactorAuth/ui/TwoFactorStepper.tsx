import { Modal } from "@/components";
import type { UserSchema } from "@/features/shared";
import { useTfaStepperContext } from "../model/TfaStepperContext";
import { InitializeStep } from "./InitializeStep";
import { ScanStep } from "./ScanStep";
import StepSuccess from "./StepSuccess";
import VerifyAndEnableTfa from "./VerifyAndEnableStep";

export default function TwoFactorStepper({ user }: { user: UserSchema }) {
  const { step, handleCloseModal } = useTfaStepperContext();
  return (
    <>
      <InitializeStep
        isEnabled={user.two_factor_enabled}
        recoveryCodes={user.two_factor_recovery_codes}
      />

      <Modal isOpen={step !== "idle"} onClose={handleCloseModal}>
        {(step === "scan" || step === "verify") && (
          <ul className="steps steps-horizontal w-full mb-8 text-xs">
            <li className="step step-primary">Scan QR</li>
            <li className={`step ${step === "verify" ? "step-primary" : ""}`}>
              Verify
            </li>
          </ul>
        )}
        {step === "scan" && (
          <ScanStep />
        )}
        {step === "verify" && (
          <VerifyAndEnableTfa />
        )}
        {step === "success" && (
          <StepSuccess />
        )}
      </Modal>
    </>
  );
}