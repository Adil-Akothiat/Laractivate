import { usePermissions, useRolesFilter } from "../hooks";
import { Button, Select } from "@/components";
import { useState } from "react";
import type { PermissionSchema } from "../../shared";

interface FilterRolesProps {
    onApply?: () => void;
}

export default function FilterRoles({ onApply }: FilterRolesProps) {
    const { data }   = usePermissions();
    const {
        group:      groupData,
        permission: permissionData,
        setFilters,
    } = useRolesFilter();

    const groups      = data?.grouped ? Object.keys(data.grouped) : [];
    const permissions = data?.permissions ?? [];

    const [group, setGroup]         = useState(groupData);
    const [permission, setPermission] = useState(permissionData);
    const [applying, setApplying]   = useState(false);

    const handleReset = () => {
        setGroup("");
        setPermission("");
        setFilters({ group: "", permission: "", page: 1 });
    };

    const handleApply = () => {
        setApplying(true);
        setTimeout(() => {
            setFilters({ group, permission, page: 1 });
            setApplying(false);
            onApply?.();
        }, 300);
    };

    const hasFilters = !!(group || permission);

    // Filter permissions by selected group
    const filteredPermissions = group
        ? (data?.grouped[group] ?? [])
        : permissions;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6">
                <Select
                    selectSize="sm"
                    label="Group"
                    options={groups.map((g) => ({ label: g, value: g }))}
                    value={group}
                    onChange={(e) => {
                        setGroup(e.target.value);
                        setPermission(""); // reset permission when group changes
                    }}
                    placeholder="All Groups"
                />

                <Select
                    selectSize="sm"
                    label="Permission"
                    options={filteredPermissions.map((p: PermissionSchema) => ({
                        label: p.name,
                        value: p.id,
                    }))}
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                    placeholder="All Permissions"
                />
            </div>

            <div className="flex items-center justify-end gap-x-3 pt-2">
                <Button
                    onClick={handleReset}
                    disabled={!hasFilters || applying}
                    size="sm"
                    variant="default"
                >
                    Reset
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApply}
                    loading={applying}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
