import { Lock, ShieldOff } from "lucide-react";
import { EmptyState } from "../../../../../../components";
import type { PermissionProps } from "../../../../rbac";


interface Props {
    permissions: PermissionProps[];
}

export default function AccountPermissions({ permissions }: Props) {
    const grouped = permissions.reduce((acc: Record<string, PermissionProps[]>, p) => {
        if (!acc[p.group]) acc[p.group] = [];
        acc[p.group].push(p);
        return acc;
    }, {});

    return (
        <div className="card bg-base-100 border border-base-200">
            <div className="card-body">
                <h3 className="font-medium text-sm text-base-content/50 uppercase tracking-wide mb-4">
                    Permissions
                </h3>
                {!permissions.length ? (
                    <EmptyState
                        icon={<ShieldOff size={32} />}
                        title="No permissions assigned"
                        description="This account has no individual permissions. Access is determined solely by its assigned roles."
                    />
                ) : (
                    <div className="space-y-4">
                        {Object.entries(grouped).map(([group, perms]) => (
                            <div key={group}>
                                <p className="text-xs font-medium text-base-content/40 mb-2">{group}</p>
                                <div className="flex flex-wrap gap-2">
                                    {perms.map((perm) => (
                                        <span
                                            key={perm.id}
                                            className="flex items-center gap-1.5 text-xs bg-base-200 text-base-content/70 px-2.5 py-1 rounded-md"
                                        >
                                            {perm.is_locked
                                                ? <Lock size={10} className="text-warning" />
                                                : null
                                            }
                                            {perm.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}