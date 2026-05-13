import { useRoles, useRolesFilter } from "../hooks";
import { type Column, Pagination, Modal, ConfirmDialog } from "@/components";
import { DataTable } from "@/components/Table";
import { useState } from "react";
import RbacHeader from "./RbacHeader";
import { useDebounce } from "@/app/hooks/common/useDebounce";
import { ScrollContainer } from "@/components/ScrollContainer";
import { UpdateRole } from "./UpdateRole";
import { useToastContext } from "@/app/hooks/common";
import { getErrorsMessages } from "@/app/utils";
import type { RoleSchema } from "../../shared";

const columns = (): Column<RoleSchema>[] => [
    {
        key: "name",
        header: "Name",
        render: (role) => <span className="font-medium">{role.name}</span>,
    },
    {
        key: "users_count",
        header: "Users",
        headerClassName: "text-center",
        className: "text-center",
        render: (role) => (
            <span className="badge badge-ghost">{role.users_count ?? 0}</span>
        ),
    },
    {
        key: "is_locked",
        header: "System",
        headerClassName: "text-center",
        className: "text-center",
        render: (role) =>
            role.is_locked ? (
                <span className="badge badge-warning badge-sm">locked</span>
            ) : (
                <span className="text-base-content/30 text-xs">—</span>
            ),
    },
];

export function RolesList() {
    const { page, search, group, permission, setFilters } = useRolesFilter();
    const debouncedSearch = useDebounce(search, 400);
    const { toast } = useToastContext();

    const { data, isPending } = useRoles.getRoles({
        page,
        search: debouncedSearch,
        group,
        permission
    });

    const { mutate: deleteRole, isPending: isDeleting } = useRoles.delete();
    const roles = data?.roles ?? [];
    const meta  = data?.meta;
    const [modal, setModal] = useState<{
        type: "edit" | "delete";
        roleId: string;
    } | null>(null);

    const closeModal = () => setModal(null);

    const handleDelete = () => {
        if (!modal?.roleId) return;
        deleteRole(modal.roleId, {
            onSuccess: ()=> {
                closeModal();
                toast.success("Role deleted successfully");
            },
            onError:(err)=> {
                const messages = getErrorsMessages(err);
                toast.error(messages.join('\n'));
            }
        });
    };

    return (
        <ScrollContainer>
            <RbacHeader />
            <DataTable<RoleSchema>
                pinRows
                columns={columns()}
                actions={[
                    {
                        permission: "roles.manage",
                        label: "Edit",
                        onClick: (role) =>
                            setModal({ type: "edit", roleId: role.id }),
                    },
                    {
                        permission: "roles.manage",
                        label:     "Delete",
                        className: "text-error",
                        hidden:    (role) => !!role.is_locked,
                        onClick:   (role) =>
                            setModal({ type: "delete", roleId: role.id }),
                    },
                ]}
                data={roles}
                keyExtractor={(role) => role.id}
                loading={isPending}
                skeletonRows={5}
                emptyMessage="No roles yet. Create your first role to get started."
            />

            <Pagination
                currentPage={page}
                totalPages={meta?.last_page ?? 1}
                total={meta?.total ?? 0}
                perPage={meta?.per_page ?? 10}
                onPageChange={(newPage) => setFilters({ page: newPage })}
            />

            {/* Edit modal */}
            <Modal
                isOpen={modal?.type === "edit"}
                onClose={closeModal}
                title="Edit Role"
                size="lg"
                showCloseButton
            >
                {modal?.type === "edit" && (
                    <UpdateRole
                        roleId={modal.roleId}
                        onSuccess={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
            {/* Delete confirm */}
            <ConfirmDialog
                isOpen={modal?.type === "delete"}
                variant="error"
                title="Delete Role?"
                message="This role will be permanently deleted. Users assigned to this role will lose its permissions."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                loading={isDeleting}
                onConfirm={handleDelete}
                onCancel={closeModal}
            />
        </ScrollContainer>
    );
}