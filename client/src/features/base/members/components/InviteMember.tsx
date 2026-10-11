import { Button, Input, LoadingOverlay, Modal, Select } from "@/components";
import { FormControl } from "@/components/FormControls";
import { FormEvent, useState } from "react";
import { useRoles } from "../../rbac";
import { useMemberMutations } from "../hooks/api/useMemberMutations";
import { InviteMemberPayload } from "../types";

type InviteMemberProps = {
    open: boolean;
    onClose: () => void;
}

export default function InviteMember({ open, onClose }: InviteMemberProps) {
    const invite = useMemberMutations.invite();
    const { data, isPending } = useRoles({ all: true, scope: 'client' });
    const [form, setForm] = useState<InviteMemberPayload>({
        email: '',
        role_id: ''
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload: InviteMemberPayload = {
            email: form.email,
            role_id: form.role_id
        };

        invite.mutate(payload, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const roles = data?.data || [];
    return (
        <Modal isOpen={open} onClose={onClose} title="Create new user account">
            {isPending ? (
                <LoadingOverlay />
            ) : (
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <Input
                            label="Email address"
                            id="member-email"
                            name="email"
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            value={form.email}
                        />
                    </FormControl>
                    <FormControl>
                        <Select
                            label="Role"
                            options={roles.map(role => ({ label: role.name, value: role.id }))}
                            onChange={(e)=> setForm(prev=> ({ ...prev, role_id: e.target.value }))}
                        />
                    </FormControl>
                    <div className="flex justify-end gap-3">
                        <Button disabled={invite.isPending} type="button" variant="default" size="sm" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            loading={invite.isPending}
                        >
                            Send Invitation
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}