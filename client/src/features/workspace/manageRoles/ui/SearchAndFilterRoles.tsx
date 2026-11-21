import { Button, Modal } from "@/components";
import { Filter } from "lucide-react";
import { useState } from "react";
import { FilterRoles, SearchRoles } from "./";

export function SearchAndFilterRoles() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-x-3">
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                className="h-fit"
            >
                <FilterRoles onApply={() => setOpen(false)} />
            </Modal>
            <SearchRoles />
            <Button
                size="sm"
                variant="default"
                leftIcon={<Filter size={14} />}
                onClick={() => setOpen(true)}
            >
                Filter
            </Button>
        </div>
    );
}