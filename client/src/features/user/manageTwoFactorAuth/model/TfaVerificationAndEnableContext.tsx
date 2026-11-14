import type { FormEvent, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useEnableTfa } from "../api";
import { useTfaStepperContext } from "./TfaStepperContext";
import type { VerifyAndEnableTfaContextProps } from "./twoFactorAuth.types";
import { useTfaRecoveryContext } from "./useTfaRecoveryContext";

const VerifyAndEnableTfaContext = createContext<VerifyAndEnableTfaContextProps | null>(null);

export function VerifyAndEnableTfaContextProvider({ children }: { children: ReactNode }) {
    const { setStep, setIsInvalid } = useTfaStepperContext();
    const enable = useEnableTfa();
    const [code, setCode] = useState<string>('');
    const { setFreshCodes } = useTfaRecoveryContext();

    const handleEnable = (otp: string) => {
        const sanitized = otp.replace(/\D/g, "").trim();
        if (sanitized.length !== 6) return;

        setIsInvalid(false);
        enable.mutate(
            { otp: sanitized },
            {
                onSuccess: (res) => {
                    setFreshCodes(res.data.data.recoveryCodes);
                    setStep("success");
                    enable.reset();
                },
                onError: () => {
                    setIsInvalid(true);
                },
            }
        );
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code.length === 6) {
            handleEnable(code);
        }
    };

    return (
        <VerifyAndEnableTfaContext.Provider value={{ enable, code, setCode, handleEnable, handleSubmit }}>
            {children}
        </VerifyAndEnableTfaContext.Provider>
    );
}

export function useVerifyAndEnableTfa() {
    const context = useContext(VerifyAndEnableTfaContext);
    if (!context) {
        throw new Error("useVerifyAndEnableTfa must be used within a VerifyAndEnableTfaContextProvider");
    }
    return context;
}