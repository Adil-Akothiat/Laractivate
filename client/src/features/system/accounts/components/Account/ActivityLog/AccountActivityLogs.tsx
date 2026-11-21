import { getErrorsMessagesStr } from "@/app/utils";
import { Alert, Pagination } from "@/components";
import { DataLoader } from "@/components/ui/feedback/DataLoader";
import { Can } from "@/components/ui/security/Can";
import ActivityLogCard from "@/entities/activityLog/ui/ActivityLogCard";
import type { LogSchema } from "@/features/shared";
import { useAccountLogs } from "@/features/system/accounts";
import { Logs } from "lucide-react";
import { useState } from "react";

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
                      <ActivityLogCard key={log.id} log={log} />
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