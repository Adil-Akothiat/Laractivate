import { ShieldBan, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTwoFactor } from "../../../auth/hooks/useTwoFactor";
import { Badge, Button } from "../../../../../components";
import { useToastContext } from "../../../../../app/hooks/useToastContext";
import { getErrorsMessages } from "../../../../../app/utils";
import Disable2FAModal from "../../../shared/components/Disable2FAModal";

interface Props {
    isPending: boolean;
    step: string;
    onEnable: () => void;
    onDisable: () => void;
}

const StepIntro = ({ isPending, step, onEnable, onDisable }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { mutate, isPending: isDisabling } = useTwoFactor.disable();
    const { toast } = useToastContext();

    const handleConfirm = (password: string) => {
        mutate({ password }, {
            onSuccess: () => {
                setModalOpen(false);
                onDisable();
                toast.success("2FA was disabled successfully");
            },
            onError: (err: any) => {
                const message = getErrorsMessages(err).join("|");
                toast.error(message);
            }
        });
    };

    return (
        <>
            <div className="space-y-3">
                <Badge
                    variant={step === "success" ? "success" : "error"}
                    outline={true}
                    size="lg"
                >
                    {step === "success" ? "Enabled" : "Disabled"}
                </Badge>
                <br />
                {step === "success" ? (
                    <Button
                        variant="error"
                        outline={true}
                        disabled={isDisabling}
                        onClick={() => setModalOpen(true)}
                    >
                        <ShieldBan size={16} />
                        Disable 2FA
                    </Button>
                ) : (
                    <Button onClick={onEnable} disabled={isPending} outline={true}>
                        {isPending ? (
                            <span className="loading loading-xs" />
                        ) : (
                            <ShieldCheck size={16} />
                        )}
                        Enable 2FA
                    </Button>
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