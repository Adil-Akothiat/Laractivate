import { Clock, Trash2 } from "lucide-react";
import { Badge, Button, Card, EmptyState } from "@/components";
import type { UserSession } from "@/features/base/settings/types";
import SessionCard from "@/features/base/shared/components/SessionCard";

interface Props {
    sessions:        UserSession[];
    isClearingHistory: boolean;
    onClearHistory:  () => void;
}

export function AccountSessionHistory({ sessions, isClearingHistory, onClearHistory }: Props) {
    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm text-base-content/50 uppercase tracking-wide">
                    Session History
                </h3>
                {sessions.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        outline
                        disabled={isClearingHistory}
                        onClick={onClearHistory}
                    >
                        <Trash2 size={13} />
                        Clear history
                    </Button>
                )}
            </div>

            {sessions.length === 0 ? (
                <EmptyState
                    icon={<Clock size={28} />}
                    title="No session history"
                    description="Past sessions will appear here once the user logs out or sessions expire."
                />
            ) : (
                <ul className="flex flex-col gap-2">
                    {sessions.map((s) => (
                        <SessionCard
                            key={s.session_id}
                            session={s}
                            badge={<Badge variant="default" size="sm" outline>Expired</Badge>}
                        />
                    ))}
                </ul>
            )}
        </Card>
    );
}