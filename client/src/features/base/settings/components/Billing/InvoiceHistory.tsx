import { useState } from "react";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { useInvoicesHistory } from "../..";
import { Pagination } from "@/components";
import InvoicesTable from "./InvoicesTable";

export default function InvoiceHistory() {
  const [page, setPage] = useState(1);
  const query = useInvoicesHistory({ page });

  return (
      <DataLoader query={query}>
        {({ data, meta }) => (
            <>
            <InvoicesTable data={data} />
            <Pagination
              currentPage={page}
              totalPages={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={setPage}
              size="xs"
            />
            </>
        )}
      </DataLoader>
  );
}