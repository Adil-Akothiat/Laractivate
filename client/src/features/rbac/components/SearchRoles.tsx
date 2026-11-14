import { Search } from "lucide-react";
import { Button, Input } from "@/components";
import { useState } from "react";
import { useRolesFilter } from "../hooks";

export default function SearchRoles() {
    const { search, setFilters } = useRolesFilter();
    const [value, setValue] = useState<string>(search);
    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ search: value });
    }
    return (
         <form 
            className="join"
            onSubmit={submitSearch}
        >
            <Input
                type="search"
                leftIcon={<Search size={14} />}
                inputSize="sm"
                className="min-w-[200px] join-item"
                id="search-accounts"
                placeholder="Search accounts..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button
                type="submit"
                size="sm"
                className="join-item"
                variant="default"
            >
                Search
            </Button>
        </form>
    );
}