import { Search } from "lucide-react";
import { Button, Input } from "@/components";
import { useAccountsFilter } from "@/features/base/accounts";
import { useState } from "react";

export default function SearchAccounts() {
    const { search:searchFilter, setFilters } = useAccountsFilter();
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
                id="search-accounts"
                placeholder="Search accounts..."
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
