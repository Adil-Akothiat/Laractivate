import { useState, useEffect } from "react";
import { useRole, useRoleMutations, usePermissions } from "../hooks";
import { LoadingOverlay, Input, Button } from "@/components";
import { FormControl } from "@/components/FormControls";
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

    const { data, isPending: isFetching } = useRole(roleId);
    const { data: permissionsData }       = usePermissions();
    const { update }                      = useRoleMutations();

    const permissions = permissionsData?.permissions ?? [];
    const grouped     = permissionsData?.grouped     ?? {};
    const isLocked    = data?.is_locked;


    // Seed form with existing role data
    useEffect(() => {
        if (data) {
            setName(data.name);
            setAttachedIds(data.permissions?.map(({id}:{id:string})=> id) as string[]);
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        update.mutate(
            { id: roleId, data: { name, permissions: attachedIds } },
            {
                onSuccess: () => {
                    onSuccess();
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
                    disabled={update.isPending || !!isLocked}
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
                        disabled={update.isPending || !!isLocked}
                    />
                </FormControl>
            )}

            {!isLocked && (
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={update.isPending}
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={update.isPending}
                        disabled={update.isPending}
                        size="sm"
                    >
                        Save changes
                    </Button>
                </div>
            )}
        </form>
    );
}
