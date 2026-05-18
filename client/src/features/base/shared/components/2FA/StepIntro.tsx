import { ShieldBan, ShieldCheck, Copy, Check, KeyRound, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Badge, Button } from "@/components";
import { useToastContext } from "@/app/hooks/common";
import { getErrorsMessagesStr } from "@/app/utils";
import Disable2FAModal from "@/features/base/shared/components/2FA/Disable2FAModal";
import { useTwoFactor } from "../../hooks";

interface Props {
    isEnabled: boolean;
    isPending: boolean;
    recoveryCodes: string[];
    onEnable: () => void;
}

const StepIntro = ({ isEnabled, isPending, recoveryCodes, onEnable }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [showCodes, setShowCodes] = useState(false);
    const [activeCodes, setActiveCodes] = useState<string[]>(recoveryCodes);

    const { mutate: disable, isPending: isDisabling } = useTwoFactor.disable();
    const { mutate: regenerate, isPending: isRegenerating } = useTwoFactor.regenerateRecovery();
    const { toast } = useToastContext();

    const handleConfirm = (password: string) => {
        disable(
            { password },
            {
                onSuccess: () => {
                    setModalOpen(false);
                    setShowCodes(false);
                    toast.success("2FA was disabled successfully");
                },
                onError: (err: any) => {
                    toast.error(getErrorsMessagesStr(err));
                },
            }
        );
    };

    const handleRegenerate = () => {
        regenerate(undefined, {
            onSuccess: (res) => {
                const codes = res.data.recovery_codes ?? [];
                setActiveCodes(codes);
                setShowCodes(true);
                toast.success("Recovery codes regenerated");
            },
            onError: (err: any) => {
                toast.error(getErrorsMessagesStr(err));
            },
        });
    };

    const copyCode = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAll = () => {
        navigator.clipboard.writeText(activeCodes.join("\n"));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Status badge */}
                <Badge variant={isEnabled ? "success" : "error"} outline={true} size="lg">
                    {isEnabled ? "Enabled" : "Disabled"}
                </Badge>

                {/* Enable / Disable button */}
                <div>
                    {isEnabled ? (
                        <Button
                            variant="error"
                            outline
                            loading={isDisabling}
                            leftIcon={<ShieldBan size={16} />}
                            onClick={() => setModalOpen(true)}
                        >
                            Disable 2FA
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            outline
                            loading={isPending}
                            loadingText="Initializing..."
                            leftIcon={<ShieldCheck size={16} />}
                            onClick={onEnable}
                        >
                            Enable 2FA
                        </Button>
                    )}
                </div>

                {/* Recovery codes — only when 2FA is active */}
                {isEnabled && activeCodes.length > 0 && (
                    <div className="mt-2">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<KeyRound size={14} />}
                                onClick={() => setShowCodes((v) => !v)}
                            >
                                {showCodes ? "Hide recovery codes" : "View recovery codes"}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                loading={isRegenerating}
                                loadingText="Regenerating..."
                                leftIcon={<RefreshCw size={13} className={isRegenerating ? "animate-spin" : ""} />}
                                className="text-warning hover:text-warning/80"
                                onClick={handleRegenerate}
                            >
                                Regenerate
                            </Button>
                        </div>

                        {showCodes && (
                            <div className="mt-3 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-base-content">
                                        Recovery Codes
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="xs"
                                        leftIcon={copiedAll ? <Check size={12} /> : <Copy size={12} />}
                                        onClick={copyAll}
                                    >
                                        {copiedAll ? "Copied!" : "Copy all"}
                                    </Button>
                                </div>
                                <p className="text-xs text-base-content/50 mb-3">
                                    Each code can only be used once. Regenerating invalidates all previous codes.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {activeCodes.map((code, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            rightIcon={
                                                copiedIndex === index
                                                    ? <Check size={12} className="text-success shrink-0" />
                                                    : <Copy size={12} className="text-base-content/30 group-hover:text-base-content/60 shrink-0" />
                                            }
                                            className="font-mono justify-between bg-base-200 hover:bg-base-300 w-full"
                                            onClick={() => copyCode(code, index)}
                                        >
                                            {code}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Disable2FAModal
                isOpen={modalOpen}
                isPending={isDisabling}
                onConfirm={handleConfirm}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
};

export default StepIntro;