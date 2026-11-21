
export type ModalStepsProps = "idle" | "init" | "scan" | "verify" | "success";

export interface TfaStepperStateProps {
    steps: string[];
    step: ModalStepsProps
    qrUrl: string;
    recoveryCodes: string[];
}
export interface TfaStepperContextProps extends TfaStepperStateProps {
    dispatch: React.Dispatch<StepperActionProps>
}


export type StepperActionProps =
    | { type: "idle" }
    | { type: "init"; payload: { qrUrl: string } }
    | { type: "scan" }
    | { type: "verify"; payload: { recoveryCodes: string[] } }
    | { type: "back-to-scan" }
    | { type: "success" }
