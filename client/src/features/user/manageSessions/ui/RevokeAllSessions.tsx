import { useToastContext } from "@/app/hooks";
import { Button } from "@/components";
import { SessionSchema } from "@/entities/session/model/session.types";
import { useRevokeAllSessions } from "../api/revokeSessions.api";

export function RevokeAllSessions({ sessions }: { sessions: SessionSchema[] }) {
    const { mutate, isPending } = useRevokeAllSessions();
    const { toast } = useToastContext();

    const revokeAllHandler = () => {
        if (sessions.length <= 1) {
            toast.info('No session to revoke!');
            return;
        }
        mutate(undefined);
    };

    return (
        <div className="flex justify-between">
            <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Active Devices
            </h3>
            <Button
                outline
                size="xs"
                variant="default"
                className="text-gray-500"
                onClick={revokeAllHandler}
                loading={isPending}
            >
                Revoke all
            </Button>
        </div>
    );
}