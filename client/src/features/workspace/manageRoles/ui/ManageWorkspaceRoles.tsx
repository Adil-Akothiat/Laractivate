import permissionsConfig from "@/app/config/permissions.json";
import { Button, Can, Modal } from "@/components";
import { WorkspaceRolesTable } from "@/entities";
import { useWorkspaceRoleContext } from "../model";
import { RoleForm } from "./RoleForm";
import { SearchAndFilterRoles } from "./SearchAndFilterRoles";

const { roles } = permissionsConfig.client
export function ManageWorkspaceRoles() {
    const { manageRoleStates } = useWorkspaceRoleContext();
    const { modalOpen, setModalOpen } = manageRoleStates;

    return (
        <div>
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            >
                <RoleForm />
            </Modal>
            <div>
                <h1 className="text-2xl font-bold text-base-content">Roles & Permissions</h1>
                <Can
                    permission={roles.manage}
                    fallback={
                        <p className="text-sm text-warning mt-1">
                            You are only allowed to view this page, contact administrator for more access.
                        </p>
                    }
                >
                    <p className="text-sm text-base-content/50 mt-1">
                        Manage roles and control what each role can do.
                    </p>
                </Can>
            </div>
            <div className="flex justify-between mt-4 mb-3">
                <SearchAndFilterRoles />
                <Can permission={roles.manage}>
                    <Button size="sm" onClick={() => setModalOpen(true)}>
                        + New role
                    </Button>
                </Can>
            </div>
            <WorkspaceRolesTable
                actions={[
                    {
                        label: "Edit",
                        permission: roles.manage,
                        hidden: (role) => role.is_locked
                    },
                    {
                        label: "Delete",
                        permission: roles.manage,
                        hidden: (role) => role.is_locked
                    }
                ]}
            />
        </div>
    );
}