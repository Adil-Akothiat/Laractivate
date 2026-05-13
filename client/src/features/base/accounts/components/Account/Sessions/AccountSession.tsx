import { useState } from "react";
import { ConfirmDialog } from "@/components";
import { useAccountMutations } from "@/features/base/accounts";
import { AccountActiveSessions } from "./AccountActiveSessions";
import { AccountSessionHistory } from "./AccountSessionHistory";
import type { SessionResponseSchema, SessionSchema } from "@/features/base/shared";
import { useToastContext } from "@/app/hooks/common";
import { getErrorsMessages } from "@/app/utils";

interface Props {
    session: SessionResponseSchema;
    userId:   string;
}

export default function AccountSessions({ session, userId }: Props) {
    const [revokeTarget,  setRevokeTarget]  = useState<SessionSchema | null>(null);
    const [revokeAll,     setRevokeAll]     = useState(false);
    const [clearHistory,  setClearHistory]  = useState(false);

    const { toast } = useToastContext();
    const { revokeSession, revokeAllSessions, clearSessionHistory } = useAccountMutations();
    function confirmRevoke() {
        if (!revokeTarget) return;
        revokeSession.mutate({id:userId, sessionId:revokeTarget.session_id}, {
            onSuccess: () => setRevokeTarget(null),
        });
    }

    function confirmRevokeAll() {
        revokeAllSessions.mutate(userId, {
            onSuccess: (res) => {
                setRevokeAll(false);
                toast.success(res.data.message);
            },
            onError: (err:any)=> {
                toast.error(getErrorsMessages(err).join('|'));
            }
        });
    }

    function confirmClearHistory() {
        clearSessionHistory.mutate(userId, {
            onSuccess: (resp) =>{
                setClearHistory(false);
                toast.success(resp.data.message);
            },
            onError: (err:any)=> {
                toast.success(getErrorsMessages(err).join('|'));
            }
        });
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <AccountActiveSessions
                    sessions={session.active}
                    onRevoke={setRevokeTarget}
                    onRevokeAll={() => setRevokeAll(true)}
                />
                <AccountSessionHistory
                    sessions={session.history}
                    isClearingHistory={clearSessionHistory.isPending}
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
                loading={revokeSession.isPending}
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
                loading={revokeAllSessions.isPending}
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
                loading={clearSessionHistory.isPending}
                onConfirm={confirmClearHistory}
                onCancel={() => setClearHistory(false)}
            />
        </>
    );
}