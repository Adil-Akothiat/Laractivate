import { Pagination } from "@/components";
import { DataLoader } from "@/components/ui/feedback/DataLoader";
import { useState } from "react";
// import { useInvoicesHistory } from "../..";
import InvoicesTable from "./InvoicesTable";

export default function InvoiceHistory() {
  // const [page, setPage] = useState(1);
  // const query = useInvoicesHistory({ page });

  // return (
  //   <DataLoader query={query}>
  //     {({ data, meta }) => (
  //       <>
  //         <InvoicesTable data={data} />
  //         <Pagination
  //           currentPage={page}
  //           totalPages={meta.last_page}
  //           total={meta.total}
  //           perPage={meta.per_page}
  //           onPageChange={setPage}
  //           size="xs"
  //         />
  //       </>
  //     )}
  //   </DataLoader>
  // );
  return "Must be moved to workspace billing settings"
}