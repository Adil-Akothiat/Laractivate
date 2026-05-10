import { Logs } from "lucide-react";
import { useState } from "react";
import { ComponentLoader } from "../../../../../components/Loaders";
import type { ActivityLogProps } from "../../types";
import LogCard from "../../../shared/components/LogCard";
import SettingsContainer from "../Shared/SettingsContainer";
import Pagination from "../../../../../components/Pagination";
import { useProfileActivityLogs } from "../../hooks";

export default function ActivityLogs() {
    const [page, setPage] = useState(1);
    const { data, isPending: loadingActivities } = useProfileActivityLogs(page);

    const logs = data?.activityLogs;

    return (
        <SettingsContainer settingsType="activity_logs">
            {loadingActivities ? (
                <ComponentLoader isLoading={loadingActivities} />
            ) : !logs || logs.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40">
                    <Logs size={32} strokeWidth={1.2} />
                    <p className="text-sm">No activity yet.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-2.5">
                        {logs.data.map((log: ActivityLogProps) => (
                            <LogCard key={log.id} log={log} />
                        ))}
                    </div>
                        <Pagination
                            currentPage={page}
                            totalPages={logs?.last_page}
                            total={logs.total}
                            perPage={logs.per_page}
                            onPageChange={setPage}
                            size="xs"
                        />
                </>
            )}
        </SettingsContainer>
    );
}