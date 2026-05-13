import { useState, useEffect } from "react";
import { useRoles } from "../index";
import { usePermissions } from "../hooks";
import { LoadingOverlay, Input, Button } from "@/components";
import { getErrorsMessages } from "@/app/utils";
import { FormControl } from "@/components/FormControls";
import { useToastContext } from "@/app/hooks/common";
import PermissionsCheckbox from "./PermissionsCheckBox";
import { toSnakeCase } from "../utils";

interface Props {
    roleId:    string;
    onSuccess: () => void;
    onCancel:  () => void;
}

export function UpdateRole({ roleId, onSuccess, onCancel }: Props) {
    const [name, setName]               = useState("");
    const [attachedIds, setAttachedIds] = useState<string[]>([]);
    const { toast }                     = useToastContext();

    const { data, isPending: isFetching }       = useRoles.getRole(roleId);
    const { data: permissionsData }             = usePermissions.getPermissions();
    const { mutate: updateRole, isPending: isUpdating } = useRoles.update();

    const permissions = permissionsData?.permissions ?? [];
    const grouped     = permissionsData?.grouped     ?? {};
    const isLocked    = data?.role.is_locked;
    const isPending   = isUpdating;

    // Seed form with existing role data
    useEffect(() => {
        if (data) {
            setName(data.role.name);
            setAttachedIds(data.attached_ids as string[]);
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateRole(
            { id: roleId, payload: { name, permissions: attachedIds } },
            {
                onSuccess: () => {
                    toast.success("Role updated successfully.");
                    onSuccess();
                },
                onError: (err) => {
                    const messages = getErrorsMessages(err);
                    toast.error(messages.join("\n"));
                },
            },
        );
    };

    if (isFetching) return <LoadingOverlay />;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormControl>
                <Input
                    label="Role name"
                    type="text"
                    placeholder="e.g. billing-manager"
                    value={name}
                    onChange={(e) => setName(toSnakeCase(e.target.value))}
                    disabled={isPending || !!isLocked}
                    required
                    maxLength={50}
                />
                {isLocked ? (
                    <span className="label-text-alt text-warning">
                        System role — name is locked
                    </span>
                ) : null}
            </FormControl>

            {permissions.length > 0 && (
                <FormControl>
                    <PermissionsCheckbox
                        permissions={permissions}
                        grouped={grouped}
                        selectedIds={attachedIds}
                        onChange={setAttachedIds}
                        disabled={isPending || !!isLocked}
                    />
                </FormControl>
            )}

            {!isLocked && (
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
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
                        size="sm"
                    >
                        Save changes
                    </Button>
                </div>
            )}
        </form>
    );
}