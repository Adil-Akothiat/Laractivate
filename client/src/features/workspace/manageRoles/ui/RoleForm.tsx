import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr, toSnakeCase } from "@/app/utils";
import { Button, FormControl, Input } from "@/components";
import { PermissionsCheckbox, useGetWorkspacePermissions } from "@/entities";
import { SubmitEventHandler, useCallback } from "react";
import { useCreateWorkspaceRole } from "../api";
import { useWorkspaceRoleContext } from "../model";

export function RoleForm() {
    const { data } = useGetWorkspacePermissions();
    const permissionIds = data?.permissionIds ?? [];
    const groupedPermissions = data?.groupedPermissions ?? [];
    const { manageRoleStates } = useWorkspaceRoleContext();
    const { name, setName, onAttachAllHandler, onAttachHandler, attachedPermissions, resetForm } = manageRoleStates;

    const { mutate, isPending } = useCreateWorkspaceRole();
    const { toast } = useToastContext();
    const handleAttachAll = useCallback(()=>{
        onAttachAllHandler(permissionIds);
    },[onAttachAllHandler, permissionIds])
    const submitRoleHandler: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        mutate({ name, permissions: attachedPermissions },
            {
                onSuccess: (res) => {
                    toast.success(res.data.message ?? "");
                    resetForm();
                },
                onError: (err) => {
                    toast.error(getErrorsMessagesStr(err));
                }
            }
        )
    }

    return (
        <form onSubmit={submitRoleHandler} className="space-y-5">
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
            <FormControl className="my-3">
                <PermissionsCheckbox
                    groupedPermissions={groupedPermissions}
                    onAttach={onAttachHandler}
                    onAttachAll={handleAttachAll}
                    attachedPermissions={attachedPermissions}
                    permissionsLength={permissionIds.length ?? 0}
                />
            </FormControl>
            <div className="flex justify-end">
                <Button size="sm" loading={isPending}>Create</Button>
            </div>
        </form>
    );
}