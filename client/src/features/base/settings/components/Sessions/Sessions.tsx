import { History } from "lucide-react";
import { ComponentLoader } from "@/components/Loaders";
import SessionHistory from "./SessionHistory";
import ActiveSessions from "./ActiveSessions";
import { useUserSessions } from "../../hooks/useSessions";
import SettingsContainer from "../Shared/SettingsContainer";
import type { SessionResponseSchema } from "@/features/base/shared";

export default function UserSessions() {
    const { data, isPending } = useUserSessions();
    if (isPending) return <ComponentLoader isLoading />;
    const { active = [], history = [] } = (data as SessionResponseSchema) ?? {};
    return (
        <SettingsContainer settingsType="sessions">
            {/* Active devices */}
            <ActiveSessions sessions={active} />
            {/* Divider */}
            {history.length > 0 && (
                <div className="divider">
                    <History size={13} className="text-base-content/30" />
                </div>
            )}
            {/* History */}
            {history.length > 0 && <SessionHistory sessions={history} />}
        </SettingsContainer>
    );
}