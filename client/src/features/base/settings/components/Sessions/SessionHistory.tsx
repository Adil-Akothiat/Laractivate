import { ShieldOff } from 'lucide-react';
import SessionCard from '@/features/base/shared/components/SessionCard';
import { Badge, Button } from '@/components';
import { useSettingsMutations } from '@/features/base/settings';
import type { SessionSchema } from '@/features/base/shared';

export default function SessionHistory({ sessions }: { sessions: SessionSchema[] }) {
    const { clearHistory, revokeSession } = useSettingsMutations();

    const revokeSessionHandler = (session: SessionSchema) => {
        revokeSession.mutate(session.session_id);
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between">
                <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                    Recent Security Activity
                </h3>
                <Button
                    outline
                    size="xs"
                    variant="default"
                    className="text-gray-500"
                    onClick={() => clearHistory.mutate(undefined)}
                    loading={clearHistory.isPending}
                >
                    Clear history
                </Button>
            </div>

            {sessions.length === 0 ? (
                <p className="text-sm text-base-content/40 py-4 text-center">No recent activity.</p>
            ) : (
                <ul className="space-y-2">
                    {sessions.map((session: SessionSchema, index) => (
                        <SessionCard
                            key={session.session_id || index}
                            session={session}
                            active={false}
                            badge={
                                session.revoked ? (
                                    <Badge size="xs" variant="error" outline>
                                        <ShieldOff size={9} /> Revoked
                                    </Badge>
                                ) : (
                                    <span className="badge badge-ghost badge-xs gap-1">
                                        <ShieldOff size={9} /> Logged Out
                                    </span>
                                )
                            }
                            onRevoke={revokeSessionHandler}
                            isRevoking={revokeSession.isPending}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
