import { useState } from "react";
import { ConfirmModal, LoadingOverlay } from "@/components";
import {
  useAccountMutations,
  useAccountSessions,
} from "@/features/base/accounts";
import { AccountActiveSessions } from "./AccountActiveSessions";
import { AccountSessionHistory } from "./AccountSessionHistory";
import type { SessionSchema } from "@/features/base/shared";
import { DataLoader } from "@/components/Loaders/DataLoader";

interface Props {
  userId: string;
}

export default function AccountSessions({ userId }: Props) {
  const [revokeTarget, setRevokeTarget] = useState<SessionSchema | null>(null);
  const [revokeAll, setRevokeAll] = useState(false);
  const [clearHistory, setClearHistory] = useState(false);

  const query = useAccountSessions(userId);
  const { revokeSession, revokeAllSessions, clearSessionHistory } =
    useAccountMutations();
  function confirmRevoke() {
    if (!revokeTarget) return;
    revokeSession.mutate(
      { id: userId, sessionId: revokeTarget.session_id },
      {
        onSuccess: () => setRevokeTarget(null),
      },
    );
  }

  function confirmRevokeAll() {
    revokeAllSessions.mutate(userId, {
      onSuccess: () => {
        setRevokeAll(false);
      },
    });
  }

  function confirmClearHistory() {
    clearSessionHistory.mutate(userId, {
      onSuccess: () => {
        setClearHistory(false);
      },
    });
  }

  return (
    <DataLoader query={query}>
      {(data) => {
        return (
          <>
            <div className="flex flex-col gap-4">
              <AccountActiveSessions
                sessions={data.active}
                onRevoke={setRevokeTarget}
                onRevokeAll={() => setRevokeAll(true)}
              />
              <AccountSessionHistory
                sessions={data.history}
                isClearingHistory={clearSessionHistory.isPending}
                onClearHistory={() => setClearHistory(true)}
              />
            </div>
            <ConfirmModal
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
            <ConfirmModal
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
            <ConfirmModal
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
      }}
    </DataLoader>
  );
}