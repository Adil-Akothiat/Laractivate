import { Search } from "lucide-react";
import { Button, Input } from "@/components";
import { useState } from "react";
import { useMembersFilter } from "../hooks/ui/useMembersFilter";

export default function SearchMembers() {
    const { search:searchFilter, setFilters } = useMembersFilter();
    const [search, setSearch] = useState(searchFilter || "");
    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ search });
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
                id="search-member"
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
