import { Shield, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, EmptyState, ConfirmModal } from "@/components";
import { useRoles } from "@/features/base/rbac";
import { useAccountMutations } from "@/features/base/accounts";
import { RoleListItem } from "./RoleListItem";
import { AssignRoleModal } from "./AssignRoleModal";
import type { RoleSchema, UserSchema } from "@/features/base/shared";

interface Props {
    user: UserSchema;
}

export default function AccountRoles({ user }: Props) {
    const { id }                          = useParams<{ id: string }>();
    const [open, setOpen]                 = useState(false);
    const [assigningId, setAssigningId]   = useState<string | null>(null);
    const [pendingRole, setPendingRole]   = useState<RoleSchema | null>(null);

    const { data }                        = useRoles({ all: true });
    const { assignRole, unAssignRole }        = useAccountMutations();

    const allRoles       = data?.data    ?? [];
    const assignedIds    = user?.roles?.map((r: RoleSchema) => r.id) ?? [];
    const availableRoles = allRoles.filter((r: RoleSchema) => !assignedIds.includes(r.id));

    function handleAssign(roleId: string) {
        setAssigningId(roleId);
        assignRole.mutate(
            { userId: id!, roleId },
            {
                onSuccess: () => setOpen(false),
                onSettled: () => setAssigningId(null),
            }
        );
    }

    function handleRemove(roleId: string) {
        const role = allRoles.find((r: RoleSchema) => r.id === roleId);
        if (!role) return;
        setPendingRole(role);
    }

    function commitRemove() {
        if (!pendingRole) return;
        unAssignRole.mutate(
            { userId: id!, roleId: pendingRole.id },
            { onSettled: () => setPendingRole(null) },
        );
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
                        {user.roles.map((role: RoleSchema) => (
                            <RoleListItem
                                key={role.id}
                                role={role}
                                isRemoving={unAssignRole.isPending}
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

            <ConfirmModal
                isOpen={!!pendingRole}
                variant="error"
                title="Unassign role"
                message={`Are you sure you want to remove the "${pendingRole?.name}" role from this user?`}
                confirmLabel="Confirm"
                loading={unAssignRole.isPending}
                onConfirm={commitRemove}
                onCancel={() => setPendingRole(null)}
            />
        </>
    );
}