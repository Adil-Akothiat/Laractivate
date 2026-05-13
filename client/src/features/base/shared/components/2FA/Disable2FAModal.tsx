import { Key } from "lucide-react";
import { useState } from "react";
import { Alert, Input, Modal } from "@/components";

interface Props {
    isOpen: boolean;
    isPending: boolean;
    onConfirm: (password: string) => void;
    onClose: () => void;
}

export default function Disable2FAModal({ isOpen, isPending, onConfirm, onClose }: Props) {
    const [password, setPassword] = useState("");

    const handleClose = () => {
        setPassword("");
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(password);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Disable 2FA"
            size="sm"
            onConfirm={handleConfirm}
            confirmText={isPending ? "Disabling..." : "Disable"}
            cancelText="Cancel"
            isConfirming={isPending}
        >
            <div className="flex flex-col gap-4">
                <Alert
                    variant="warning"
                    message="Disabling 2FA will make this account less secure. The user will only need a password to log in."
                />
                <Input
                    label="Confirm your password to proceed"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Key size={14} />}
                    placeholder="Enter your password"
                />
            </div>
        </Modal>
    );
}