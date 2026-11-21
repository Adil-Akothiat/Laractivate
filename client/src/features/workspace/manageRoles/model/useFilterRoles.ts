import { FilterQueriesProps } from "@/entities";
import { useSearchParams } from "react-router-dom";

export function useFilterRoles() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Get current values from URL
    const page = Number(searchParams.get('page') || 1);
    const search = searchParams.get('search') || '';
    const order = searchParams.get('order') || '';
    const sort = searchParams.get('sort') || '';

    // 2. Multi-parameter setter
    const setFilters = (
        filters: Partial<FilterQueriesProps>,
    ) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(filters).forEach(([key, value]) => {
                if (value) next.set(key, String(value));
                else next.delete(key);
            });

            // Logical reset: if any filter besides page changes, go back to page 1
            if (Object.keys(filters).some((k) => k !== 'page')) {
                next.set('page', '1');
            }

            return next;
        });
    };


    const filterQueries = { page, search, order, sort, setFilters };

    return {
        filterQueries
    }
}