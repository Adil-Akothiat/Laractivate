import { Logs } from "lucide-react";
import { useState } from "react";
import LogCard from "@/features/base/shared/components/LogCard";
import { useAccountLogs } from "@/features/base/accounts";
import { Alert, Pagination } from "@/components";
import type { LogSchema } from "@/features/base/shared";
import { Can } from "@/components/Guard/Can";
import { DataLoader } from "@/components/Loaders/DataLoader";
import { getErrorsMessagesStr } from "@/app/utils";

type Props = {
  userId: string;
};
export default function AccountActivityLogs({ userId }: Props) {
  const [page, setPage] = useState(1);
  const query = useAccountLogs(userId, page);
  return (
    <Can
      permission={["all", "logs.view"]}
      fallback={
        <Alert
          variant="warning"
          message={getErrorsMessagesStr(query.error)}
        />
      }
    >
      <DataLoader query={query}>
        {(data) => {
          const { data: logs, meta } = data;
          return (
            <>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40">
                  <Logs size={32} strokeWidth={1.2} />
                  <p className="text-sm">No activity yet.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {logs.map((log: LogSchema) => (
                      <LogCard key={log.id} log={log} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={meta?.last_page}
                    total={meta?.total}
                    perPage={meta?.per_page}
                    onPageChange={setPage}
                    size="xs"
                  />
                </>
              )}
            </>
          );
        }}
      </DataLoader>
    </Can>
  );
}