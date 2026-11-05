import { GlobalPageLoader } from '@/components/Loaders/Loaders';
import { useWorkspacesQueries } from '@/features/base/workspaces/hooks/api/useWorkspaceQueries';
import { Outlet, useParams } from 'react-router-dom';
import ErrorPage from '../pages/app/404';

export function WorkspaceGuard() {
    const params = useParams();
    const workspaceSlug = params?.workspaceSlug ?? '';
    const { data, isPending } = useWorkspacesQueries.verifySlug(workspaceSlug);
    if(isPending) return <GlobalPageLoader isLoading={isPending}/>;
    if(!data?.verified || !params?.workspaceSlug) {
        window.localStorage.removeItem('workspace_slug');
        return (
            <ErrorPage 
                redirectTo="/workspaces"
                redirectLabel='Workspaces'
            />
        );
    }
    window.localStorage.setItem('workspace_slug', workspaceSlug);
    return <Outlet />;
}