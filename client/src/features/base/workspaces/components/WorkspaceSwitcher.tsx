import { DataLoader } from '@/components/Loaders/DataLoader';
import React from 'react';
import { WorkspacesList } from './WorkspacesList';
import { useWorkspacesQueries } from '../hooks/api/useWorkspaceQueries';

export const WorkspaceSwitcher: React.FC = () => {

    const query = useWorkspacesQueries.list();

    return (
        <DataLoader query={query}>
            {
                (data) => {
                    return <WorkspacesList workspaces={data.workspaces} currentClientId={data.current_client_id} />
                }
            }
        </DataLoader>
    );
};