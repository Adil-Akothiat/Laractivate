import { StepperActionProps, TfaStepperStateProps } from "./twoFactorAuth.types";

export const tfaStepperInitialState: TfaStepperStateProps = {
    steps: ["scan", "verify", "success"],
    step: "idle",
    qrUrl: "",
    recoveryCodes: []
};

export function stepperReducer(state: TfaStepperStateProps, action: StepperActionProps): TfaStepperStateProps {
    switch (action.type) {
        case "idle":
            return tfaStepperInitialState;
        case "init":
            return { ...state, step: "scan", qrUrl: action.payload.qrUrl };
        case "scan":
            return { ...state, step: "verify" };
        case "verify":
            return { ...state, step: "success", recoveryCodes: action.payload.recoveryCodes }
        case "back-to-scan":
            return { ...state, step: "scan", };
        default:
            return state;
    }
}