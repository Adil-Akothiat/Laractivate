import { DataLoader } from '@/components/ui/feedback/DataLoader';
import React from 'react';
import { useWorkspacesQueries } from '../hooks/api/useWorkspaceQueries';
import { WorkspacesList } from './WorkspacesList';

export const WorkspaceSwitcher: React.FC = () => {
    const query = useWorkspacesQueries.list();

    return (
        <DataLoader query={query}>
            {
                (data) => {
                    return <WorkspacesList workspaces={data?.workspaces} currentClientId={data?.current_client_id} />
                }
            }
        </DataLoader>
    );
};