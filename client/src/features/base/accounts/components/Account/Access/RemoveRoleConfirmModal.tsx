import { AlertTriangle, ShieldOff, Trash2 } from "lucide-react";
import { Modal, Button } from "../../../../../../components";
import type { RoleProps } from "../../../../rbac";

type RemoveGuard =
    | { kind: "confirm";           role: RoleProps }
    | { kind: "last-role";         role: RoleProps }
    | { kind: "super-admin-sole";  role: RoleProps };

interface Props {
    guard:      RemoveGuard | null;
    isRemoving: boolean;
    onConfirm:  () => void;
    onClose:    () => void;
}

const COPY = {
    "confirm": {
        icon:           <Trash2 size={20} className="text-error" />,
        title:          "Remove role",
        description:    (role: RoleProps) =>
            `Are you sure you want to remove the "${role.name}" role from this user?`,
        confirmLabel:   "Remove",
        confirmVariant: "error" as const,
        blockOnly:      false,
    },
    "last-role": {
        icon:           <ShieldOff size={20} className="text-warning" />,
        title:          "User will lose all access",
        description:    (role: RoleProps) =>
            `Removing "${role.name}" will leave this user with no roles. They won't be able to access the app until a role is re-assigned.`,
        confirmLabel:   "Remove anyway",
        confirmVariant: "warning" as const,
        blockOnly:      false,
    },
    "super-admin-sole": {
        icon:           <AlertTriangle size={20} className="text-error" />,
        title:          "Cannot remove sole super admin",
        description:    (role: RoleProps) =>
            `"${role.name}" can only be removed when there is more than one super admin. Assign this role to another user first.`,
        confirmLabel:   null,
        confirmVariant: "error" as const,
        blockOnly:      true,
    },
} as const;

export function RemoveRoleConfirmModal({ guard, isRemoving, onConfirm, onClose }: Props) {
    if (!guard) return null;

    const { icon, title, description, confirmLabel, confirmVariant, blockOnly } = COPY[guard.kind];

    return (
        <Modal
            isOpen={!!guard}
            onClose={onClose}
            title={title}
            size="sm"
            showCloseButton
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    {icon}
                    <p className="text-sm text-base-content/70 leading-relaxed">
                        {description(guard.role)}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={onClose}>
                        {blockOnly ? "Got it" : "Cancel"}
                    </Button>
                    {!blockOnly && confirmLabel && (
                        <Button
                            size="sm"
                            variant={confirmVariant}
                            loading={isRemoving}
                            disabled={isRemoving}
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export type { RemoveGuard };