import { Filter } from "lucide-react";
import { Button, Modal } from "../../../../../components";
import { useState } from "react";
import FilterAccounts from "./FilterAccounts";
import SearchAccounts from "./SearchAccounts";
import type { RoleProps } from "../../../rbac";

type Props = {
    roles: RoleProps[];
}
export default function FilterAndSearchAccounts({roles}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-x-3">
            <Modal
                isOpen={open} 
                onClose={()=> setOpen(false)}
                className="h-fit"
            >
                <FilterAccounts
                    onApply={()=> setOpen(false)}
                    roles={roles}
                />
            </Modal>
            <SearchAccounts />
            <Button
                size="sm"
                variant="default"
                leftIcon={<Filter size={14} />}
                onClick={() => setOpen(true)}
            >
                Filter
            </Button>
            <div>
            </div>
        </div>
    );
}