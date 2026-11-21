import { Button } from "@/components";
import { useGetUser } from "@/entities/user";
import { UserSchema } from "@/features/shared";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";
import { useRegenerateRecoveryCodes } from "../api";
import { useTfaContext } from "../model/useTfaContext";

export function TfaRecoveryCodes() {
    const { data: user } = useGetUser();
    const { step } = useTfaContext();
    const recoveryCodes = user?.two_factor_recovery_codes ?? [];
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState<boolean>(false);
    const [showCodes, setShowCodes] = useState<boolean>(true);

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

    const { mutate, isPending } = useRegenerateRecoveryCodes();
    const queryClient = useQueryClient();
    const regenerateHandler = () => {
        mutate(undefined, {
            onSuccess: (res) => {
                queryClient.setQueryData<UserSchema>(['user'], (oldUser) => {
                    if (!oldUser) return oldUser;
                    return {
                        ...oldUser,
                        two_factor_recovery_codes: res.data.data.recoveryCodes ?? []
                    }
                })
            },
        })
    }

    return (
        <div className="w-full text-left">
            {/* Action row */}
            {
                step === "idle" && (
                    <div className="flex items-center gap-3 mb-3">
                        <Button
                            onClick={() => setShowCodes((v) => !v)}
                            variant="default"
                            outline
                            size="sm"
                            leftIcon={
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${showCodes ? "rotate-180" : "rotate-0"
                                        }`}
                                />
                            }
                        >
                            {showCodes ? "Hide recovery codes" : "View recovery codes"}
                        </Button>

                        {/* Regenerate is destructive — warn with error variant */}
                        <Button
                            loading={isPending}
                            loadingText="Regenerating..."
                            onClick={regenerateHandler}
                            variant="primary"
                            outline
                            size="sm"
                        >
                            Regenerate
                        </Button>
                    </div>
                )
            }
            {
                showCodes && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-base-content">
                                Save Your Recovery Codes
                            </p>
                            <button
                                onClick={() => copyAll(recoveryCodes)}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                                {copiedAll ? (
                                    <><Check size={12} /> Copied!</>
                                ) : (
                                    <><Copy size={12} /> Copy all</>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-base-content/50 mb-3">
                            These codes let you access your account if you lose your authenticator. Each code works only once — store them somewhere safe before closing this window.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {recoveryCodes.map((code, index) => (
                                <button
                                    key={index}
                                    onClick={() => copyCode(code, index)}
                                    className="flex items-center justify-between bg-base-200 hover:bg-base-300 rounded-md px-3 py-2 font-mono text-xs text-base-content transition-colors group"
                                >
                                    <span>{code}</span>
                                    {copiedIndex === index ? (
                                        <Check size={12} className="text-success shrink-0" />
                                    ) : (
                                        <Copy size={12} className="text-base-content/30 group-hover:text-base-content/60 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )
            }
        </div>
    );
}