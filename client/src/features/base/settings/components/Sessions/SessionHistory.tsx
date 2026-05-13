import { ShieldOff } from "lucide-react";
import SessionCard from "@/features/base/shared/components/SessionCard";
import { Badge, Button } from "@/components";
import { useToastContext } from "@/app/hooks/common";
import { useClearHistory, useRevokeUserSessions } from "@/features/base/settings/hooks/useSessions";
import type { SessionSchema } from "@/features/base/shared";

export default function SessionHistory({ sessions }: { sessions: SessionSchema[] }) {
    const { toast } = useToastContext();
    const { mutate:clearHistory, isPending:isClearing } = useClearHistory();
    const clearHistoryHandler = ()=> {
        clearHistory("_", {
            onSuccess: (data)=> toast.success(data.data.message),
            onError: ()=> toast.error('Clear history failed!')
        })
    }

    const { mutate: revoke, isPending } = useRevokeUserSessions();
    
    const revokeSessionHandler = (session:SessionSchema) => {
        revoke(session.session_id, {
            onSuccess: () => {
                toast.success("Session revoked!");
            },
            onError: () => {
                toast.error("Session faild!");
            },
        });
    };


    return (
        <div className="space-y-3">
            <div className="flex justify-between">
                <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Recent Security Activity
                </h3>
                <Button
                    outline={true}
                    size="xs"
                    variant="default"
                    className="text-gray-500"
                    onClick={clearHistoryHandler}
                    loading={isClearing}
                >
                    Clear history
                </Button>
            </div>

            {sessions.length === 0 ? (
                <p className="text-sm text-base-content/40 py-4 text-center">No recent activity.</p>
            ) : (
                <ul className="space-y-2">
                    {sessions.map((session:SessionSchema, index) => (
                        <SessionCard
                            key={session.session_id || index}
                            session={session}
                            active={false}
                            badge={
                                session.revoked ? (
                                    <Badge
                                        size="xs"
                                        variant="error"
                                        outline={true}
                                    >
                                        <ShieldOff size={9} /> Revoked
                                    </Badge>
                                ) : (
                                    <span className="badge badge-ghost badge-xs gap-1">
                                        <ShieldOff size={9} /> Logged Out
                                    </span>
                                )
                            }
                            onRevoke={revokeSessionHandler}
                            isRevoking={isPending}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}