import { Mail } from "lucide-react";
import { Button, Input, Modal, Switch } from "@/components";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getErrorsMessages } from "@/app/utils";
import { useToastContext } from "@/app/hooks/common";
import { FormControl } from "@/components/FormControls";
import type { UserSchema } from "@/features/base/shared";
import { useAccountMutations } from "../../../hooks";

type Props = {
    user:    UserSchema;
    isOpen:  boolean;
    onClose: () => void;
};

type FormProps = {
    firstName: string;
    lastName:  string;
    is_active: boolean;
};

export default function AccountProfileEditModal({ user, isOpen, onClose }: Props) {
    const { id } = useParams<{ id: string }>();
    const [form, setForm] = useState<FormProps>({
        firstName: user.first_name,
        lastName:  user.last_name,
        is_active: user?.is_active || false
    });

    const { update } = useAccountMutations();
    const { toast } = useToastContext();

    const handleSave = () => {
        update.mutate(
            {
                id: id!,
                data: {
                    first_name: form.firstName,
                    last_name:  form.lastName,
                    is_active:  form.is_active
                },
            },
            {
                onSuccess: ()=> {
                    toast.success("Profile updated successfully");
                    onClose();
                },
                onError: (err: any)=> {
                    const message = getErrorsMessages(err).join(", ") || "Failed to update profile";
                    toast.error(message);
                }
            },
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
            size="md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        variant="default"
                        size="sm"
                        disabled={update.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        size="sm"
                        loading={update.isPending}
                        disabled={update.isPending}
                    >
                        Save
                    </Button>
                </div>
            }
        >
            <form className="flex flex-col gap-4">
                <FormControl className="grid grid-cols-2 gap-3">
                    <Input
                        label="First name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        disabled={update.isPending}
                    />
                    <Input
                        label="Last name"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        disabled={update.isPending}
                    />
                </FormControl>
                <FormControl>
                    <Input
                        label="Email (read-only)"
                        type="email"
                        defaultValue={user.email}
                        leftIcon={<Mail size={14} />}
                        disabled
                    />
                </FormControl>
                <FormControl>
                    <Switch 
                        label="Active"
                        checked={form.is_active}
                        disabled={update.isPending}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                </FormControl>
            </form>
        </Modal>
    );
}