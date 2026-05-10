import { useState } from "react";
import { ConfirmDialog } from "../../../../../../components";
import type { UserSession } from "../../../../settings/types";
import { useAccounts } from "../../../hooks";
import { AccountActiveSessions } from "./AccountActiveSessions";
import { AccountSessionHistory } from "./AccountSessionHistory";

interface Sessions {
    active:  UserSession[];
    history: UserSession[];
}

interface Props {
    sessions: Sessions;
    userId:   string;
}

export default function AccountSessions({ sessions, userId }: Props) {
    const [revokeTarget,  setRevokeTarget]  = useState<UserSession | null>(null);
    const [revokeAll,     setRevokeAll]     = useState(false);
    const [clearHistory,  setClearHistory]  = useState(false);

    const { mutate: revokeOne,      isPending: isRevoking        } = useAccounts.revokeSession();
    const { mutate: revokeAllFn,    isPending: isRevokingAll      } = useAccounts.revokeAllSessions();
    const { mutate: clearHistoryFn, isPending: isClearingHistory  } = useAccounts.clearSessionHistory();

    function confirmRevoke() {
        if (!revokeTarget) return;
        revokeOne({accountId:userId, sessionId:revokeTarget.session_id}, {
            onSuccess: () => setRevokeTarget(null),
        });
    }

    function confirmRevokeAll() {
        revokeAllFn(userId, {
            onSuccess: () => setRevokeAll(false),
        });
    }

    function confirmClearHistory() {
        clearHistoryFn(userId, {
            onSuccess: () => setClearHistory(false),
        });
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <AccountActiveSessions
                    sessions={sessions.active}
                    onRevoke={setRevokeTarget}
                    onRevokeAll={() => setRevokeAll(true)}
                />
                <AccountSessionHistory
                    sessions={sessions.history}
                    isClearingHistory={isClearingHistory}
                    onClearHistory={() => setClearHistory(true)}
                />
            </div>

            {/* Revoke single */}
            <ConfirmDialog
                isOpen={!!revokeTarget}
                variant="warning"
                title="Revoke session?"
                message={`This will immediately sign out the session on ${revokeTarget?.browser} / ${revokeTarget?.platform}. The user will need to log in again on that device.`}
                confirmLabel="Revoke"
                cancelLabel="Cancel"
                loading={isRevoking}
                onConfirm={confirmRevoke}
                onCancel={() => setRevokeTarget(null)}
            />

            {/* Revoke all others */}
            <ConfirmDialog
                isOpen={revokeAll}
                variant="error"
                title="Revoke all other sessions?"
                message="All sessions except the current one will be terminated. The user will be signed out from all other devices."
                confirmLabel="Revoke all"
                cancelLabel="Cancel"
                loading={isRevokingAll}
                onConfirm={confirmRevokeAll}
                onCancel={() => setRevokeAll(false)}
            />

            {/* Clear history */}
            <ConfirmDialog
                isOpen={clearHistory}
                variant="warning"
                title="Clear session history?"
                message="All past session records for this user will be permanently deleted. Active sessions are not affected."
                confirmLabel="Clear history"
                cancelLabel="Cancel"
                loading={isClearingHistory}
                onConfirm={confirmClearHistory}
                onCancel={() => setClearHistory(false)}
            />
        </>
    );
}