import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr, toSnakeCase } from "@/app/utils";
import { Button, FormControl, Input, Modal } from "@/components";
import { PermissionsCheckbox, useGetWorkspacePermissions } from "@/entities";
import { SubmitEventHandler, useCallback, useEffect } from "react";
import { useCreateWorkspaceRole, useUpdateWorkspaceRole } from "../api";
import { useWorkspaceRoleContext } from "../model";

export function RoleFormModal() {
    const { data } = useGetWorkspacePermissions();
    const permissionIds = data?.permissionIds ?? [];
    const groupedPermissions = data?.groupedPermissions ?? [];
    const { manageRoleStates } = useWorkspaceRoleContext();
    const { name, setName, onAttachAllHandler, onAttachHandler, attachedPermissions, setAttachedPermissions, resetForm, modalOpen, setModalOpen, role } = manageRoleStates;

    const createRole = useCreateWorkspaceRole();
    const updateRole = useUpdateWorkspaceRole();
    const { toast } = useToastContext();
    const isPending = createRole.isPending || updateRole.isPending;
    const handleAttachAll = useCallback(() => {
        onAttachAllHandler(permissionIds);
    }, [onAttachAllHandler, permissionIds])


    const submitRoleHandler: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (role) {
            updateRole.mutate({ id: role.id, name, permissions: attachedPermissions },
                {
                    onSuccess: (res) => {
                        toast.success(res.message ?? "");
                        resetForm();
                    },
                    onError: (err) => {
                        toast.error(getErrorsMessagesStr(err));
                    }
                }
            );
            return;
        }
        createRole.mutate({ name, permissions: attachedPermissions },
            {
                onSuccess: (res) => {
                    toast.success(res.message ?? "");
                    resetForm();
                },
                onError: (err) => {
                    toast.error(getErrorsMessagesStr(err));
                }
            }
        )
    }

    useEffect(() => {
        if (role) {
            setName(role.name);
            setAttachedPermissions(role.permissions?.map(perm => perm.id) ?? [])
        } else {
            setName("");
            setAttachedPermissions([]);
        }
    }, [role])

    return (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
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
                    <Button size="sm" loading={isPending}>{role ? "Save" : "Create"}</Button>
                </div>
            </form>
        </Modal>
    );
}