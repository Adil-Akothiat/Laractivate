import { Shield, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components";
import type { RoleSchema } from "@/features/base/shared";

interface Props {
    role:       RoleSchema;
    isRemoving: boolean;
    onRemove:   (roleId: string) => void;
}

export function RoleListItem({ role, isRemoving, onRemove }: Props) {
    return (
        <div 
            className="flex items-center justify-between py-2.5"
            title={role.is_locked ? "System roles cannot be removed" : "Remove role"}
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
                variant="ghost"
                square
                disabled={!!role.is_locked || isRemoving}
                onClick={() => onRemove(role.id)}
            >
                <Trash2 size={13} className="text-error" />
            </Button>
        </div>
    );
}