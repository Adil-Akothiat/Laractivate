import { ShieldCheck } from "lucide-react";
import SessionCard from "@/features/base/shared/components/SessionCard";
import { Badge, Button } from "@/components";
import { useToastContext } from "@/app/hooks/common";
import { useRevokeAllSessions, useRevokeUserSessions } from "@/features/base/settings/hooks/useSessions";
import type { SessionSchema } from "@/features/base/shared";

export default function ActiveSessions({ sessions }: { sessions: SessionSchema[] }) {
    const { mutate: revokeAll, isPending:isPendingAll } = useRevokeAllSessions();
    const { toast } = useToastContext();
    const revokeAllHandler = ()=> {
        if(sessions.length <= 1) {  
            toast.info('No session to revoke!');
            return;
        }
        revokeAll('', {
            onSuccess: (data)=> toast.success(data.data.message),
            onError: ()=> toast.error('Revoke all sessions failed!')
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
                    Active Devices
                </h3>
                 <Button
                    outline={true}
                    size="xs"
                    variant="default"
                    className="text-gray-500"
                    onClick={revokeAllHandler}
                    loading={isPendingAll}
                >
                    Revoke all
                </Button>
            </div>

            {sessions.length === 0 ? (
                <p className="text-sm text-base-content/40 py-4 text-center">No active sessions.</p>
            ) : (
                <ul className="space-y-2">
                    {sessions.map((session, index) => (
                        <SessionCard
                            key={session.session_id || index}
                            session={session}
                            active
                            badge={
                                session.is_current ? (
                                    <Badge 
                                        size="xs"
                                        variant="primary"
                                        outline
                                    >
                                        <ShieldCheck size={9} /> Current
                                    </Badge>
                                ) : null
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