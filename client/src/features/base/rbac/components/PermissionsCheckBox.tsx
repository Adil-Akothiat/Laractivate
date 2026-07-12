import { Checkbox } from "@/components/FormControls";
import type { PermissionGroupSchema, PermissionSchema } from "../../shared";

interface Props {
    grouped:     PermissionGroupSchema;
    permissions: PermissionSchema[];
    selectedIds: string[];
    onChange:    (ids: string[]) => void;
    disabled?:   boolean;
}

export default function PermissionsCheckbox({ grouped, permissions, selectedIds, onChange, disabled = false }: Props) {
    const toggle = (id: string, name?: string) => {
        // Required permission "dashboard.view" must always be attached
        if(name === "dashboard.view" && selectedIds.includes(id)){
            return;
        }
        onChange(
            selectedIds.includes(id)
                ? selectedIds.filter((i) => i !== id)
                : [...selectedIds, id]
        );
    };

    const toggleGroup = (perms: PermissionSchema[]) => {
        const ids         = perms.filter((p) => !p.is_locked && p.name !== "dashboard.view").map((p) => p.id);
        const allSelected = ids.every((id) => selectedIds.includes(id));
        if (allSelected) {
            onChange(selectedIds.filter((id) => !ids.includes(id)));
        } else {
            onChange([...new Set([...selectedIds, ...ids])]);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="label-text font-medium">Permissions</label>
                <span className="text-xs text-base-content/50">
                    {selectedIds.length} of {permissions.length} selected
                </span>
            </div>

            <div className="border border-base-200 rounded-xl divide-y divide-base-200 max-h-72 overflow-y-auto">
                {Object.entries(grouped).map(([group, perms]) => {
                    const unlocked    = perms.filter((p) => !p.is_locked);
                    const ids         = unlocked.map((p) => p.id);
                    const allChecked  = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
                    const someChecked = ids.some((id) => selectedIds.includes(id));

                    return (
                        <div key={group} className="p-3">
                            {/* Group header */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                                    {group}
                                </span>
                                {unlocked.length > 0 && (
                                    <Checkbox
                                        variant="primary"
                                        inputSize="sm"
                                        checked={allChecked}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someChecked && !allChecked;
                                        }}
                                        onChange={() => toggleGroup(perms)}
                                        disabled={disabled}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 pl-1">
                                {perms.map((perm:PermissionSchema) => (
                                    <div key={perm.id} className="flex items-center justify-between">
                                        <span className={`text-sm ${perm.is_locked ? "text-base-content/40" : "text-base-content/70"}`}>
                                            {perm.name}
                                            {!!perm.is_locked && (
                                                <span className="ml-1.5 text-xs text-warning">(locked)</span>
                                            )}
                                        </span>
                                        <Checkbox
                                            variant="primary"
                                            inputSize="sm"
                                            checked={selectedIds.includes(perm.id)}
                                            onChange={() => toggle(perm.id, perm.name)}
                                            disabled={disabled || !!perm.is_locked}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}