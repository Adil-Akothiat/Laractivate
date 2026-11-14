import { Button, Modal } from "@/components";
import { useState } from "react";
import { Filter } from "lucide-react";
import FilterMembers from "./FilterMembers";
import SearchMembers from "./SearchMembers";

export default function FilterAndSearchMembers() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center gap-x-3">
            <Modal
                isOpen={open} 
                onClose={()=> setOpen(false)}
                className="h-fit"
            >
                <FilterMembers
                    onApply={()=> setOpen(false)}
                />
            </Modal>
            <SearchMembers />
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