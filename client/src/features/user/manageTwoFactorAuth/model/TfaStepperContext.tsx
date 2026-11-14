import { createContext, ReactNode, useContext, useState } from "react";
import { ModalStepsProps, TfaStepperContextProps } from "./twoFactorAuth.types";
import { useTfaRecoveryContext } from "./useTfaRecoveryContext";

const TfaStepperContext = createContext<TfaStepperContextProps | null>(null);

export function TfaStepperContextProvider({ children }: { children: ReactNode }) {
    const [step, setStep] = useState<ModalStepsProps>("idle");
    const [qrUrl, setQrUrl] = useState<string>("");
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const { setFreshCodes } = useTfaRecoveryContext();

    const handleCloseModal = () => {
        setStep("idle");
        setFreshCodes([]);
        setQrUrl("");
        setIsInvalid(false);
    };


    const onBack = (reset?: () => void) => {
        setIsInvalid(false);
        setStep("scan");
        reset && reset();
    }

    return (
        <TfaStepperContext.Provider value={{ step, setStep, qrUrl, setQrUrl, isInvalid, setIsInvalid, modalOpened, setModalOpened, handleCloseModal, onBack }}>
            {children}
        </TfaStepperContext.Provider>
    );
}

export function useTfaStepperContext() {
    const context = useContext(TfaStepperContext);
    if (!context) {
        throw new Error("useTwoFactor must be used within a TwoFactorProvider");
    }
    return context;
}