import { Badge } from "@/components";
import { type SessionSchema, SessionCard } from "@/entities/session";
import { ShieldOff } from "lucide-react";
import { ClearSessionHistory } from "../ui";

export function SessionHistory({ sessions }: { sessions: SessionSchema[] }) {
    return (
        <div className="space-y-3">
            <div className='space-y-3'>
                <ClearSessionHistory />
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
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}