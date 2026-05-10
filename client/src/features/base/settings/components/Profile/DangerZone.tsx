import { useNavigate } from "react-router-dom";
import { useDeactivateAccount, useDeleteAccount } from "../../hooks";
import { useState } from "react";
import Modal from "../../../../../components/Modal";
import { getErrorsMessages } from "../../../../../app/utils";
import { Trash2 } from "lucide-react";
import { Alert, Button } from "../../../../../components";
import { Input } from "../../../../../components";

type Props = {
    roles?: string[];
};
export default function DangerZone({ roles }: Props) {
    const isSuperAdmin = roles?.includes("Super Admin");
    const navigate = useNavigate();
    const { mutate: deactivate, isPending: isDeactivating } =
        useDeactivateAccount();
    const { mutate: deleteAcc, isPending: isDeleting } = useDeleteAccount();

    const [modal, setModal] = useState<"deactivate" | "delete" | null>(null);
    const [password, setPassword] = useState("");
    const [apiError, setApiError] = useState<string | null>(null);

    const closeModal = () => {
        setModal(null);
        setPassword("");
        setApiError(null);
    };

    const handleConfirm = () => {
        setApiError(null);
        const payload = { password };
        if (modal === "deactivate") {
            deactivate(payload, {
                onSuccess: () => navigate("/login"),
                onError: (err: any) => setApiError(getErrorsMessages(err)[0]),
            });
        } else {
            deleteAcc(payload, {
                onSuccess: () => navigate("/login"),
                onError: (err: any) => setApiError(getErrorsMessages(err)[0]),
            });
        }
    };

    const isPending = isDeactivating || isDeleting;

    return (
        <>
            {/* Deactivate modal */}
            <Modal
                isOpen={modal === "deactivate"}
                title="Deactivate Account"
                onClose={closeModal}
                onConfirm={handleConfirm}
                confirmText="Deactivate"
                cancelText="Cancel"
                isConfirming={isPending}
            >
                <p className="text-sm text-base-content/70 mb-3">
                    Your account will be deactivated. You can contact support to
                    reactivate it.
                </p>
                {apiError && <Alert variant="error" message={apiError} />}
                <label className="label">
                    <span className="label-text">Confirm your password</span>
                </label>
                <Input
                    type="password"
                    label=""
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    required
                />
            </Modal>

            {/* Delete modal */}
            <Modal
                isOpen={modal === "delete"}
                title="Delete Account Permanently"
                onClose={closeModal}
                onConfirm={handleConfirm}
                confirmText="Delete Forever"
                cancelText="Cancel"
                isConfirming={isPending}
            >
                <p className="text-sm text-base-content/70 mb-3">
                    This action is <strong>irreversible</strong>. All your data
                    will be permanently erased.
                </p>
                {apiError && <Alert variant="error" message={apiError} />}
                <Input
                    type="password"
                    label="Confirm your password"
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    required
                />
            </Modal>

            <div className="flex flex-wrap justify-between border-t border-gray-300 py-4 gap-3">
                <div className="md:w-6/12">
                    <h3 className="font-bold">Delete Account</h3>
                    <p className={`${isSuperAdmin ? "text-warning" : "text-gray-700"} text-sm`}>
                        {isSuperAdmin
                            ? " Since you are a Super Admin, you cannot delete your account. Please contact another Super Admin for assistance."
                            : "When you delete your account you lose access to Front account services, and we permanently delete your personal data."}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="error"
                        outline={true}
                        onClick={() =>
                            isSuperAdmin ? null : setModal("delete")
                        }
                        disabled={isSuperAdmin}
                    >
                        <Trash2 size={14} />
                        Delete Account
                    </Button>
                </div>
            </div>
        </>
    );
}