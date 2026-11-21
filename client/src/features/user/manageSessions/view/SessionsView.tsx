import { DataLoader } from '@/components/ui/feedback/DataLoader';
import { useGetSessions } from '@/entities/session';
import { SettingsContainer } from '@/pages/user';
import { ActiveSessions, SessionHistory } from "..";

export function SessionsView() {
    const query = useGetSessions();
    return (
        <DataLoader query={query}>
            {(res) => {
                const { history: historySessions, active: activeSessions } = res.data.data;
                return (
                    <SettingsContainer settingsType="sessions">
                        <ActiveSessions sessions={activeSessions} />
                        {history.length > 0 && <SessionHistory sessions={historySessions} />}
                    </SettingsContainer>
                );
            }}
        </DataLoader>
    );
}
