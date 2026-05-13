import { useEffect, useState } from "react";
import { useRoles } from "../index";
import { Input, Button, Modal } from "@/components";
import { FormControl } from "@/components/FormControls";
import { usePermissions } from "../hooks";
import PermissionsCheckbox from "./PermissionsCheckBox";
import { getErrorsMessages } from "@/app/utils";
import { Can } from "@/components/Guard/Can";
import { toSnakeCase } from "../utils";

interface Props {
    onSuccess?: (msg:string) => void;
    onFailure?: (msg:string) => void;
}

export function CreateRole({ onSuccess, onFailure }: Props) {
    const [open, setOpen]               = useState(false);
    const [name, setName]               = useState("");
    
    const { mutate: createRole, isPending } = useRoles.create();
    const { data } = usePermissions.getPermissions();
    const permissions = data?.permissions ?? [];
    const grouped     = data?.grouped     ?? {};
    const defaultPermission = data?.default;
    const [attachedIds, setAttachedIds] = useState<string[]>([defaultPermission?.id]);

    useEffect(()=>{
        if(defaultPermission) {
            setAttachedIds([defaultPermission.id]);
        }
    },[defaultPermission])

    const handleClose = () => {
        setOpen(false);
        setName("");
        setAttachedIds([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(attachedIds);
        // return;
        createRole(
            { name, permissions: attachedIds },
            {
                onSuccess: () => {
                    handleClose();
                    onSuccess?.("Role Created Successfully");
                },
                onError: (err) => {
                    handleClose();
                    const msg = getErrorsMessages(err).join(", ") || "Failed to create role";
                    onFailure?.(msg);
                }
            },
        );
    };

    return (
        <>
        <Can permission='roles.manage'>
            <Button size="sm" onClick={() => setOpen(true)}>
                + New role
            </Button>
        </Can>
            <Modal
                isOpen={open}
                onClose={handleClose}
                title="Create Role"
                size="lg"
                showCloseButton
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isPending}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isPending}
                            disabled={isPending}
                            onClick={handleSubmit}
                            size="sm"
                        >
                            Create role
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormControl>
                        <Input
                            label="Role name"
                            type="text"
                            placeholder="e.g. billing-manager"
                            value={name}
                            onChange={(e) => setName(toSnakeCase(e.target.value))}
                            disabled={isPending}
                            required
                            maxLength={50}
                        />
                    </FormControl>

                    {permissions.length > 0 && (
                        <FormControl>
                            <PermissionsCheckbox
                                permissions={permissions}
                                grouped={grouped}
                                selectedIds={attachedIds}
                                onChange={setAttachedIds}
                                disabled={isPending}
                            />
                        </FormControl>
                    )}
                </form>
            </Modal>
        </>
    );
}