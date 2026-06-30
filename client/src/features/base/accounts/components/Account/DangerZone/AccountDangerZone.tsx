import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Button,
    Card,
    Input,
    Modal,
} from "@/components";
import { Can } from "@/components/Guard/Can";
import { useAccountMutations } from "@/features/base/accounts";
import type { UserSchema } from "@/features/base/shared";

interface Props {
    user: UserSchema;
}

export default function AccountDangerZone({ user }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const { remove } = useAccountMutations();

    function handleClose() {
        setOpen(false);
        setEmailInput("");
    }

    function handleDelete() {
        remove.mutate(id!, {
            onSuccess: () => navigate("/accounts"),
        });
    }

    return (
        <>
            <Card>
                <h3 className="font-medium text-sm text-error/70 uppercase tracking-wide mb-3">
                    Danger Zone
                </h3>
                <Can
                    permission={["users.delete"]}
                    fallback={
                        <Alert
                            title="Permission"
                            message="You don't have the permission to delete the account"
                            variant="default"
                        />
                    }
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">
                                Delete this account
                            </p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                This action is permanent and cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="error"
                            outline
                            size="sm"
                            onClick={() => setOpen(true)}
                            disabled={user.owner}
                        >
                            <Trash2 size={14} />
                            Delete
                        </Button>
                    </div>
                </Can>
                {user.owner && (
                    <p className="text-xs text-warning mt-2">
                        Owner accounts cannot be deleted.
                    </p>
                )}
            </Card>

            <Modal isOpen={open} onClose={handleClose} title="Delete Account">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                        <Trash2 size={16} className="text-error" />
                    </div>
                    <p className="text-xs text-base-content/50">
                        This cannot be undone
                    </p>
                </div>

                <p className="text-sm text-base-content/70 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-base-content">
                        {user.full_name}
                    </span>
                    ? All their data will be permanently removed.
                </p>

                <Input
                    label="Enter user email to validate the process"
                    type="email"
                    placeholder={user.email}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={remove.isPending}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="error"
                        loading={remove.isPending}
                        onClick={handleDelete}
                    >
                        Delete account
                    </Button>
                </div>
            </Modal>
        </>
    );
}