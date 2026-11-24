import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr } from "@/app/utils";
import { ConfirmModal } from "@/components";
import { useRemoveWorkspaceRole } from "../api";
import { useWorkspaceRoleContext } from "../model";

export function DeleteRole() {
    const { mutate, isPending } = useRemoveWorkspaceRole();
    const { toast } = useToastContext();
    const { manageRoleStates } = useWorkspaceRoleContext();
    const { confirmModalOpen, setConfirmModalOpen, role, setRole } = manageRoleStates;

    const removeRoleHandler = () => {
        if (!role) {
            
            return;
        }
        mutate(role.id, {
            onSuccess: (res) => {
                setConfirmModalOpen(false);
                setRole(null);
                toast.success(res.message ?? "Role deleted!");
            },
            onError: (error) => {
                toast.error(getErrorsMessagesStr(error));
            }
        })
    }

    return (
        <ConfirmModal
            variant="error"
            isOpen={confirmModalOpen}
            onConfirm={removeRoleHandler}
            onCancel={() => setConfirmModalOpen(false)}
            message="Are you sure want to delete the role?"
            confirmLabel="Delete"
            loading={isPending}
        />
    );
}