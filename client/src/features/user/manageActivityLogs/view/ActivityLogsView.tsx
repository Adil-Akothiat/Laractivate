import { DataLoader, Pagination } from "@/components";
import { useGetActivityLogs } from "@/entities/activityLog";
import { LogSchema } from "@/entities/activityLog/model/activityLog.types";
import ActivityLogCard from "@/entities/activityLog/ui/ActivityLogCard";
import { SettingsContainer } from "@/pages/user";
import { useState } from "react";

export default function ActivityLogsView() {
    const query = useGetActivityLogs();
    const [page, setPage] = useState<number>(1);

    return (
        <DataLoader query={query}>
            {(data) => {
                const { data: logs, meta } = data;
                return (
                    <SettingsContainer settingsType="activity_logs">
                        <div className="space-y-2.5">
                            {logs.map((log: LogSchema) => (
                                <ActivityLogCard key={log.id} log={log} />
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