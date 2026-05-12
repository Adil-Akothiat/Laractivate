import { Lock, Key } from "lucide-react";
import { useState } from "react";
import {
    Card,
    Button,
    Input,
    Modal,
    Alert
} from "@/components";
import { useAccounts } from "@/features/base/accounts"
import { useParams } from "react-router-dom";
import { getErrorsMessages } from "@/app/utils";
import { FormControl } from "@/components/FormControls";

export default function AccountPasswordCard() {
    const { id } = useParams<{ id: string }>();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const {
        mutate: changePassword,
        isPending,
        isError,
        error,
    } = useAccounts.changePassword();

    const handleClose = () => {
        setOpen(false);
        setForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });
    };

    const handleSubmit = () => {
        changePassword({ id: id!, data: form }, { onSuccess: handleClose });
    };

    return (
        <>
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                            <Lock size={15} className="text-base-content/50" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Password</p>
                            <p className="text-xs text-base-content/40 mt-0.5">
                                Update the account password
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        outline
                        onClick={() => setOpen(true)}
                    >
                        Change password
                    </Button>
                </div>
            </Card>
            <Modal
                isOpen={open}
                onClose={handleClose}
                title="Change Password"
                size="sm"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            loading={isPending}
                            disabled={isPending}
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-4">
                    <Alert
                        variant="info"
                        message="The user will be required to log in again after the password is changed."
                    />
                    {isError &&
                        getErrorsMessages(error).map((msg, i) => (
                            <Alert key={i} variant="error" message={msg} />
                        ))}
                    <FormControl>
                        <Input
                            label="Current password"
                            type="password"
                            leftIcon={<Key size={14} />}
                            value={form.current_password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    current_password: e.target.value,
                                })
                            }
                            disabled={isPending}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            label="New password"
                            type="password"
                            leftIcon={<Key size={14} />}
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            disabled={isPending}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            label="Confirm new password"
                            type="password"
                            leftIcon={<Key size={14} />}
                            value={form.password_confirmation}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password_confirmation: e.target.value,
                                })
                            }
                            disabled={isPending}
                        />
                    </FormControl>
                </form>
            </Modal>
        </>
    );
}