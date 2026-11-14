import { SetStateProps } from "@/app/types";
import type { FormEvent } from "react";
import type { useEnableTfa, useRegenerateRecoveryCodes } from "../api";

export type ModalStepsProps = "idle" | "scan" | "verify" | "success"

export interface TfaStepperContextProps {
    step: ModalStepsProps;
    setStep: SetStateProps<ModalStepsProps>;
    qrUrl: string;
    setQrUrl: SetStateProps<string>;
    modalOpened: boolean;
    setModalOpened: SetStateProps<boolean>;
    isInvalid: boolean;
    setIsInvalid: SetStateProps<boolean>;
    handleCloseModal: () => void;
    onBack: (reset: () => void) => void;
}

export interface TfaRecoveryContextProps {
    freshCodes: string[];
    setFreshCodes: SetStateProps<string[]>;
    copiedIndex: number | null;
    setCopiedIndex: SetStateProps<number | null>;
    copiedAll: boolean;
    setCopiedAll: SetStateProps<boolean>;
    showCodes: boolean;
    setShowCodes: SetStateProps<boolean>;
    regenerateRecoveryCodes: ReturnType<typeof useRegenerateRecoveryCodes>;
    regenerateHandler: () => void;
    copyCode: (code: string, index: number) => void;
    copyAll: (recoveryCodes: string[]) => void;
}

export interface VerifyAndEnableTfaContextProps {
    enable: ReturnType<typeof useEnableTfa>;
    code: string;
    setCode: SetStateProps<string>;
    handleEnable: (otp: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}