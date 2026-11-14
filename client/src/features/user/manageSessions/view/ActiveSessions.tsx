import { Badge } from "@/components";
import { type SessionSchema, SessionCard } from "@/entities/session";
import { ShieldCheck } from "lucide-react";
import { RevokeAllSessions, RevokeSession } from "../ui";

export function ActiveSessions({ sessions }: { sessions: SessionSchema[] }) {
    if (sessions.length === 0) {
        return <p className="text-sm text-base-content/40 py-4 text-center">No active sessions.</p>;
    }
    return (
        <div className="space-y-3">
            <RevokeAllSessions sessions={sessions} />
            <ul className="space-y-2">
                {sessions.map((session, index) => (
                    <SessionCard
                        key={session.session_id || index}
                        session={session}
                        active
                        badge={
                            session.is_current ? (
                                <Badge size="xs" variant="primary" outline>
                                    <ShieldCheck size={9} /> Current
                                </Badge>
                            ) : null
                        }
                        action={<RevokeSession session={session} />}
                    />
                ))}
            </ul>
        </div>
    );
}