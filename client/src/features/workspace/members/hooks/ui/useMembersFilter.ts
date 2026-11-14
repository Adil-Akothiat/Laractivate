import { useSearchParams } from "react-router-dom";

export const useMembersFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Get current values from URL
    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const joined = searchParams.get("joined") || "";

    // 2. Multi-parameter setter
    const setFilters = (
        filters: Partial<{
            page: number;
            search: string;
            status: string;
            joined: string;
        }>,
    ) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    next.set(key, String(value));
                } else {
                    next.delete(key);
                }
            });

            // Logical reset: if any filter besides page changes, reset to page 1
            if (Object.keys(filters).some((k) => k !== "page")) {
                next.set("page", "1");
            }

            return next;
        });
    };

    return { page, search, status, joined, setFilters };
};