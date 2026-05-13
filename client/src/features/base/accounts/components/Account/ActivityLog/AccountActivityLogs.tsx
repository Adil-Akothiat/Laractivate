import { Logs } from "lucide-react";
import { useState } from "react";
import LogCard from "@/features/base/shared/components/LogCard";
import { ComponentLoader } from "@/components/Loaders";
import { useAccountLogs } from "@/features/base/accounts";
import { Pagination } from "@/components";
import type { LogSchema } from "@/features/base/shared";

type Props = {
    userId:string;
}
export default function AccountActivityLogs({ userId }:Props) {
    const [page, setPage] = useState(1);
    const { data, isPending } = useAccountLogs(userId, page);
    const response = data?.data;
    const activityLogs = response?.data || [];
    const meta = response?.meta;
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
                        {activityLogs.map((log: LogSchema) => (
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
}