import { History } from 'lucide-react';
import SessionHistory from './SessionHistory';
import ActiveSessions from './ActiveSessions';
import { useUserSessions } from '../../hooks';
import SettingsContainer from '../Shared/SettingsContainer';
import { DataLoader } from '@/components/Loaders/DataLoader';

export default function UserSessions() {
    const query = useUserSessions();
    return (
        <DataLoader query={query}>
            {(data) => {
                return (
                    <SettingsContainer settingsType="sessions">
                        <ActiveSessions sessions={data.active} />
                        {history.length > 0 && (
                            <div className="divider">
                                <History size={13} className="text-base-content/30" />
                            </div>
                        )}
                        {history.length > 0 && <SessionHistory sessions={data.history} />}
                    </SettingsContainer>
                );
            }}
        </DataLoader>
    );
}
