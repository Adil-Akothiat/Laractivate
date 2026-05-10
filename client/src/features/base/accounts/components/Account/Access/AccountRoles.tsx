import { Shield, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, EmptyState } from "../../../../../../components";
import { useRoles } from "../../../../rbac/hooks";
import { useAccounts } from "../../../hooks";
import type { User } from "../../../../settings";
import type { RoleProps } from "../../../../rbac";
import { RoleListItem } from "./RoleListItem";
import { AssignRoleModal } from "./AssignRoleModal";
import { RemoveRoleConfirmModal } from "./RemoveRoleConfirmModal";
import type { RemoveGuard } from "./RemoveRoleConfirmModal";

interface Props {
    user: User;
}

export default function AccountRoles({ user }: Props) {
    const { id }                                    = useParams<{ id: string }>();
    const [open, setOpen]                           = useState(false);
    const [assigningId, setAssigningId]             = useState<string | null>(null);
    const [removeGuard, setRemoveGuard]             = useState<RemoveGuard | null>(null);

    const { data: rolesData }                       = useRoles.getRoles();
    const { mutate: update, isPending: isUpdating } = useAccounts.update();

    const allRoles       = rolesData?.roles ?? [];
    const assignedIds    = user?.roles?.map((r: RoleProps) => r.id) ?? [];
    const availableRoles = allRoles.filter((r: RoleProps) => !assignedIds.includes(r.id));

    function handleAssign(roleId: string) {
        setAssigningId(roleId);
        update(
            { id: id!, data: { roles: [...assignedIds, roleId] } },
            {
                onSuccess: () => setOpen(false),
                onSettled: () => setAssigningId(null),
            },
        );
    }

    function handleRemove(roleId: string) {
        const role = allRoles.find((r: RoleProps) => r.id === roleId);
        if (!role) return;

        // Guard 1: block if this is the only super admin in the app
        if (role.is_super_admin && (role.users_count ?? 0) < 2) {
            setRemoveGuard({ kind: "super-admin-sole", role });
            return;
        }

        // Guard 2: warn if removing this leaves the user with no roles
        if (assignedIds.length === 1) {
            setRemoveGuard({ kind: "last-role", role });
            return;
        }

        // Default: always confirm before removing
        setRemoveGuard({ kind: "confirm", role });
    }

    function commitRemove(roleId: string) {
        update({
            id: id!,
            data: { roles: assignedIds.filter((rid) => rid !== roleId) },
        });
        setRemoveGuard(null);
    }

    return (
        <>
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-medium text-sm text-base-content/50 uppercase tracking-wide">
                            Roles
                        </h3>
                        <p className="text-xs text-base-content/40 mt-0.5">
                            Roles assigned to this account
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        outline
                        leftIcon={<Plus size={13} />}
                        onClick={() => setOpen(true)}
                        disabled={availableRoles.length === 0}
                    >
                        Assign role
                    </Button>
                </div>

                {!user?.roles?.length ? (
                    <EmptyState
                        icon={<Shield size={28} />}
                        title="No roles assigned"
                        description="Assign a role to grant this user a set of permissions."
                    />
                ) : (
                    <div className="flex flex-col divide-y divide-base-200">
                        {user.roles.map((role: RoleProps) => (
                            <RoleListItem
                                key={role.id}
                                role={role}
                                isRemoving={isUpdating}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </Card>

            <AssignRoleModal
                open={open}
                availableRoles={availableRoles}
                assigningId={assigningId}
                onAssign={handleAssign}
                onClose={() => setOpen(false)}
            />

            <RemoveRoleConfirmModal
                guard={removeGuard}
                isRemoving={isUpdating}
                onConfirm={() => removeGuard && commitRemove(removeGuard.role.id)}
                onClose={() => setRemoveGuard(null)}
            />
        </>
    );
}