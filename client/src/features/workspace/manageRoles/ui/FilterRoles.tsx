import { Button, Select } from "@/components";
import { useState } from "react";
import { useWorkspaceRoleContext } from "../model";

interface FilterRolesProps {
    onApply?: () => void;
}

export function FilterRoles({ onApply }: FilterRolesProps) {
    const { filterQueries } = useWorkspaceRoleContext();
    const {
        sort,
        order,
        setFilters
    } = filterQueries;
    const [applying, setApplying] = useState(false);

    const orderByOptions = [
        { label: 'Order by', value: '' },
        { label: 'Role Name A-Z', value: 'asc' },
        { label: 'Role Name Z-A', value: 'desc' }
    ];
    const sortByOptions = [
        { label: 'Sort by', value: '' },
        { label: 'Latest', value: 'latest' },
        { label: 'Oldest', value: 'oldest' }
    ];

    const [orderBy, setOrderBy] = useState<string>(order ?? "");
    const [sortBy, setSortBy] = useState<string>(sort ?? "");
    const handleReset = () => {
        setFilters({ page: 1, order: "", sort: "" });
    };

    const handleApply = () => {
        setApplying(true);
        setTimeout(() => {
            setFilters({ page: 1, order: orderBy, sort: sortBy });
            setApplying(false);
            onApply?.();
        }, 300);
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6">
                <Select
                    selectSize="sm"
                    options={orderByOptions}
                    value={orderBy}
                    onChange={(e) => {
                        setOrderBy(e.target.value);
                    }}
                />
                <Select
                    selectSize="sm"
                    options={sortByOptions}
                    value={orderBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                    }}
                />
            </div>
            <div className="flex items-center justify-end gap-x-3 pt-2">
                <Button
                    onClick={handleReset}
                    disabled={applying}
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
