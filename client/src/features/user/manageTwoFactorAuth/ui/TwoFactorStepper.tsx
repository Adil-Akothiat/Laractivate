import { Modal } from "@/components";
import { useTfaContext } from "../model/useTfaContext";
import { InitializeStep } from "./InitializeStep";
import { ScanStep } from "./ScanStep";
import StepSuccess from "./StepSuccess";
import VerifyAndEnableTfa from "./VerifyAndEnableStep";

export default function TwoFactorStepper() {
  const { steps, step, dispatch } = useTfaContext();

  return (
    <>
      <InitializeStep />
      <Modal isOpen={step !== "idle"} onClose={() => dispatch({ type: "idle" })}>
        {(step === "scan" || step === "verify") && (
          <ul className="steps steps-horizontal w-full mb-8 text-xs">
            {
              steps.map((value, i) => (
                <li key={i} className={`step capitalize ${value === step ? "step-primary" : ""}`}>{value}</li>
              ))
            }
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