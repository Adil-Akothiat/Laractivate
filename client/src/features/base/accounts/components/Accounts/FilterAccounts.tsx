import { useAccountsFilter } from "../..";
import { type RoleProps } from "../../../rbac";
import { Button, Select } from "../../../../../components";
import { useState } from "react";

const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

interface FilterAccountsProps {
    onApply?: () => void;
    roles:RoleProps[];
}

export default function FilterAccounts({ onApply, roles }: FilterAccountsProps) {
    const {
        role: roleProp,
        status: statusProp,
        setFilters,
    } = useAccountsFilter();
    const [role, setRole] = useState(roleProp);
    const [status, setStatus] = useState(statusProp);
    const [applying, setApplying] = useState(false);
    const handleReset = () => {
        setRole('');
        setStatus('');
        // onReset?.();
    };

    const handleApply = () => {
        setApplying(true);
        setTimeout(() => {
            setFilters({ role, status });
            setApplying(false);
            onApply?.();
        }, 300);
    };
    const hasFilters = !!(role || status);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6">
                <div className="form-control w-full">
                    <Select
                        selectSize="sm"
                        label="Role"
                        options={roles?.map(
                            (r: RoleProps) => ({
                                label: r.name,
                                value: r.name,
                            }),
                        )}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="All Roles"
                    />
                </div>

                <div className="form-control w-full">
                    <Select
                        selectSize="sm"
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="All"
                    />
                </div>
            </div>

            {/* Footer */}
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