import { Logs } from "lucide-react";
import { useState } from "react";
import type { ActivityLogProps } from "@/features/base/settings/types";
import LogCard from "@/features/base/shared/components/LogCard";
import { ComponentLoader } from "@/components/Loaders";
import { useAccounts } from "@/features/base/accounts";
import { Pagination } from "@/components";

type Props = {
    userId:string;
}
export default function AccountActivityLogs({ userId }:Props) {
    const [page, setPage] = useState(1);
    const { data, isPending } = useAccounts.getActivityLogs(page, userId!);
    const logs = data?.data?.activityLogs;
    const activityLogs = logs?.data || [];
    if(isPending) return <ComponentLoader isLoading={isPending}/>
    return (
        <>
            {activityLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40">
                    <Logs size={32} strokeWidth={1.2} />
                    <p className="text-sm">No activity yet.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-2.5">
                        {activityLogs.map((log: ActivityLogProps) => (
                            <LogCard key={log.id} log={log} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={page}
                        totalPages={logs?.last_page}
                        total={logs?.total}
                        perPage={logs?.per_page}
                        onPageChange={setPage}
                        size="xs"
                    />
                </>
            )}
        </>
    );
}