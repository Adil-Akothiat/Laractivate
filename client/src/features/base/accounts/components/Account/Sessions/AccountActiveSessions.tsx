import { LogOut, WifiOff } from "lucide-react";
import { Button, Card, EmptyState } from "../../../../../../components";
import type { UserSession } from "../../../../settings/types";
import SessionCard from "../../../../shared/components/SessionCard";

interface Props {
    sessions:       UserSession[];
    // isRevoking:     boolean;
    onRevoke:       (session: UserSession) => void;
    onRevokeAll:    () => void;
}

export function AccountActiveSessions({
    sessions,
    onRevoke,
    onRevokeAll,
}: Props) {
    const otherActive = sessions.filter((s) => !s.is_current);

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-medium text-sm text-base-content/50 uppercase tracking-wide">
                        Active Sessions
                    </h3>
                    <p className="text-xs text-base-content/40 mt-0.5">
                        {sessions.length} session{sessions.length !== 1 ? "s" : ""} currently active
                    </p>
                </div>
                {otherActive.length > 0 && (
                    <Button
                        variant="error"
                        size="xs"
                        outline
                        onClick={onRevokeAll}
                    >
                        <LogOut size={13} />
                        Revoke all others
                    </Button>
                )}
            </div>

            {sessions.length === 0 ? (
                <EmptyState
                    icon={<WifiOff size={28} />}
                    title="No active sessions"
                    description="This user has no active sessions at the moment."
                />
            ) : (
                <ul className="flex flex-col gap-2">
                    {sessions.map((s) => (
                        <SessionCard
                            key={s.session_id}
                            session={s}
                            active
                            // isRevoking={isRevoking && revokeTargetId === s.session_id}
                            onRevoke={onRevoke}
                        />
                    ))}
                </ul>
            )}
        </Card>
    );
}