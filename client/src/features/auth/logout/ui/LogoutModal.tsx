import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr } from "@/app/utils";
import { Modal } from "@/components";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api";
import { LogoutModalProps } from "../model";

export function LogoutModal({ isOpen, setIsOpen }: LogoutModalProps) {
    const { mutate, isPending } = useLogoutMutation();
    const navigate = useNavigate();
    const { toast } = useToastContext();

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => navigate("/login"),
            onError: (err: any) => {
                toast.error(getErrorsMessagesStr(err));
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Confirm Logout"
            onConfirm={handleLogout}
            onClose={() => setIsOpen(false)}
            confirmText="Logout"
            cancelText="Cancel"
            isConfirming={isPending}
        >
            <p>Are you sure you want to log out?</p>
        </Modal>
    );
}