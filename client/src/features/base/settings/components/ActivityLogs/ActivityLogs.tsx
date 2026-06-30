import { useState } from "react";
import { useProfileActivityLogs } from "../../hooks";
import LogCard from "@/features/base/shared/components/LogCard";
import SettingsContainer from "../Shared/SettingsContainer";
import Pagination from "@/components/Pagination/Pagination";
import type { LogSchema } from "@/features/base/shared";
import { DataLoader } from "@/components/Loaders/DataLoader";

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const query = useProfileActivityLogs(page);
  
  return (
    <DataLoader query={query}>
      {(data) => {
        const { data:logs, meta } = data;
        return (
          <SettingsContainer settingsType="activity_logs">
            <div className="space-y-2.5">
              {logs.map((log: LogSchema) => (
                <LogCard key={log.id} log={log} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={meta.last_page}
              total={meta.total}
              perPage={meta.per_page}
              onPageChange={setPage}
              size="xs"
            />
          </SettingsContainer>
        );
      }}
    </DataLoader>
  );
}