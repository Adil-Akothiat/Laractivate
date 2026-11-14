import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { useRegenerateRecoveryCodes } from "../api";
import { TfaRecoveryContextProps } from "./twoFactorAuth.types";


const TfaRecoveryContext = createContext<TfaRecoveryContextProps | null>(null);

export const TfaRecoveryContextProvider = ({ children }: { children: ReactNode }) => {
    const [freshCodes, setFreshCodes] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState<boolean>(false);
    const [showCodes, setShowCodes] = useState<boolean>(false);
    const regenerateRecoveryCodes = useRegenerateRecoveryCodes();
    const queryClient = useQueryClient();

    const regenerateHandler = () => {
        regenerateRecoveryCodes.mutate(undefined, {
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
        })
    }
    const copyCode = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAll = (recoveryCodes: string[]) => {
        navigator.clipboard.writeText(recoveryCodes.join("\n"));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    return (
        <TfaRecoveryContext.Provider
            value={{
                freshCodes,
                setFreshCodes,
                copiedIndex,
                setCopiedIndex,
                copiedAll,
                setCopiedAll,
                showCodes,
                setShowCodes,
                regenerateRecoveryCodes,
                regenerateHandler,
                copyCode,
                copyAll,
            }}
        >
            {children}
        </TfaRecoveryContext.Provider>
    );

}

export function useTfaRecoveryContext() {
    const context = useContext(TfaRecoveryContext);
    if (!context) {
        throw new Error("useTwoFactor must be used within a TwoFactorProvider");
    }
    return context;
}