import { Button } from "@/components";
import { SessionSchema } from "@/entities/session/model/session.types";
import { Trash2 } from "lucide-react";
import { useRevokeSession } from "../api/revokeSession.api";

export function RevokeSession({ session }: { session: SessionSchema }) {
    const { mutate, isPending } = useRevokeSession();
    const revokeSessionHandler = () => {
        mutate(session.session_id);
    };
    return (
        <Button
            variant="error"
            size="xs"
            outline
            onClick={revokeSessionHandler}
            loading={isPending}
        >
            <Trash2 size={12} /> Revoke
        </Button>
    );
}