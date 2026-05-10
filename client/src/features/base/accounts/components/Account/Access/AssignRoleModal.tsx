import { Shield } from "lucide-react";
import { Badge, Button, Modal, EmptyState } from "../../../../../../components";
import type { RoleProps } from "../../../../rbac";

interface Props {
    open:           boolean;
    availableRoles: RoleProps[];
    assigningId:    string | null;
    onAssign:       (roleId: string) => void;
    onClose:        () => void;
}

export function AssignRoleModal({ open, availableRoles, assigningId, onAssign, onClose }: Props) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Assign Role"
            size="sm"
            showCloseButton
        >
            <div className="flex flex-col gap-2">
                {availableRoles.length === 0 ? (
                    <EmptyState
                        icon={<Shield size={24} />}
                        title="No roles available"
                        description="All roles are already assigned to this user."
                    />
                ) : (
                    availableRoles.map((role) => (
                        <div
                            key={role.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-base-200 hover:bg-base-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-base-content/40" />
                                <span className="text-sm font-medium">{role.name}</span>
                                {!!role.is_locked && (
                                    <Badge variant="warning" size="xs">System</Badge>
                                )}
                            </div>
                            <Button
                                size="sm"
                                variant="primary"
                                loading={assigningId === role.id}
                                disabled={assigningId !== null}
                                onClick={() => onAssign(role.id)}
                            >
                                Assign
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
}