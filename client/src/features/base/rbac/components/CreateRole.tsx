import { useEffect, useState } from "react";
import { useRoleMutations, usePermissions } from "../hooks";
import { Input, Button, Modal } from "@/components";
import { FormControl } from "@/components/FormControls";
import PermissionsCheckbox from "./PermissionsCheckBox";
import { Can } from "@/components/Guard/Can";
import { toSnakeCase } from "../utils";

export function CreateRole() {
    const [open, setOpen]               = useState(false);
    const [name, setName]               = useState("");

    const { create }                    = useRoleMutations();
    const { data }                      = usePermissions();
    const permissions                   = data?.permissions  ?? [];
    const grouped                       = data?.grouped      ?? {};
    const defaultPermission             = data?.default;
    const [attachedIds, setAttachedIds] = useState<string[]>([]);

    useEffect(() => {
        if (defaultPermission) {
            setAttachedIds([defaultPermission.id]);
        }
    }, [defaultPermission]);

    const handleClose = () => {
        setOpen(false);
        setName("");
        setAttachedIds([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        create.mutate(
            { name, permissions: attachedIds },
            {
                onSuccess:()=> handleClose()
            }
        );
    };

    return (
        <>
            <Can permission="roles.manage">
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
                            disabled={create.isPending}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={create.isPending}
                            disabled={create.isPending}
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
                            disabled={create.isPending}
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
                                disabled={create.isPending}
                            />
                        </FormControl>
                    )}
                </form>
            </Modal>
        </>
    );
}
