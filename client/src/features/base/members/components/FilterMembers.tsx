import { Button, Select } from "@/components";
import { useState } from "react";
import { useMembersFilter } from "../hooks/ui/useMembersFilter";

const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
];

const JOINED_OPTIONS = [
    { label: "All", value: "" },
    { label: "Joined", value: "joined" },
    { label: "Pending", value: "pending" },
];

interface FilterMembersProps {
    onApply?: () => void;
}

export default function FilterMembers({ onApply }: FilterMembersProps) {
    const {
        status: statusProp,
        joined: joinedProp,
        setFilters,
    } = useMembersFilter();

    const [status, setStatus] = useState(statusProp || "");
    const [joined, setJoined] = useState(joinedProp || "");
    const [applying, setApplying] = useState(false);

    const handleReset = () => {
        setStatus("");
        setJoined("");
        setFilters({ status: "", joined: "" });
    };

    const handleApply = () => {
        setApplying(true);
        setTimeout(() => {
            setFilters({ status, joined });
            setApplying(false);
            onApply?.();
        }, 300);
    };

    const hasFilters = !!(status || joined);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6">
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

                <div className="form-control w-full">
                    <Select
                        selectSize="sm"
                        label="Membership Status"
                        options={JOINED_OPTIONS}
                        value={joined}
                        onChange={(e) => setJoined(e.target.value)}
                        placeholder="All Members"
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