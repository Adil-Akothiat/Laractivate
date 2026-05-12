import { Shield, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Card, Badge, Button } from "@/components";
import { useToastContext } from "@/app/hooks/useToastContext";
import { getErrorsMessages } from "@/app/utils";
import { useAccounts } from "@/features/base/accounts";
import Disable2FAModal from "@/features/base/shared/components/Disable2FAModal";
// Assuming your hook is exported from a hooks file

interface Props {
    user: any;
}

export default function AccountTwoFactorCard({ user }: Props) {
    const [open, setOpen] = useState(false);
    const { toast } = useToastContext();
    // Initialize the hook
    const { mutate: disable2FA, isPending } = useAccounts.disableTwoFactor();
    const isEnabled = !!user?.two_factor_enabled;

    // const handleDisable = () => {
    //     disable2FA (
    //         {
    //             id: user.id,
    //             data: {password}
    //         },
    //         {
    //             onSuccess: () => {
    //                 setOpen(false);
    //                 toast.success("Two-Factor Authentication disabled successfully");
    //                 setPassword(""); // Clear password on success
    //             },
    //             onError: (err: any) => {
    //                 const message = getErrorsMessages(err).join('\n') || "Failed to disable Two-Factor Authentication";
    //                 toast.error(message);
    //             }
    //         }
    //     );
    // };

    const handleConfirm = (password: string) => {
        disable2FA(
            { id: user.id, data: { password } },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast.success(
                        "Two-Factor Authentication disabled successfully",
                    );
                },
                onError: (err: any) => {
                    const message =
                        getErrorsMessages(err).join("\n") ||
                        "Failed to disable Two-Factor Authentication";
                    toast.error(message);
                },
            },
        );
    };

    if (!isEnabled)
        return (
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                            <Shield
                                size={15}
                                className="text-base-content/50"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Two-Factor Authentication
                            </p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                2FA is not enabled. The user must enable it from
                                their own settings.
                            </p>
                        </div>
                    </div>
                    <Badge variant="default" size="sm" outline>
                        <XCircle size={11} className="mr-1" /> Disabled
                    </Badge>
                </div>
            </Card>
        );

    return (
        <>
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                            <Shield
                                size={15}
                                className="text-base-content/50"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                Two-Factor Authentication
                            </p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Revoke 2FA access for this account if needed
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="success" size="sm">
                            <CheckCircle size={11} className="mr-1" /> Enabled
                        </Badge>
                        <Button
                            variant="error"
                            size="sm"
                            outline
                            onClick={() => setOpen(true)}
                        >
                            Disable
                        </Button>
                    </div>
                </div>
            </Card>
            <Disable2FAModal
                isOpen={open}
                isPending={isPending}
                onConfirm={handleConfirm}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
