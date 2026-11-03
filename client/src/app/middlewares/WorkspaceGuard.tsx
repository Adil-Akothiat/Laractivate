import { GlobalPageLoader } from '@/components/Loaders/Loaders';
import { useWorkspacesQueries } from '@/features/base/workspaces/hooks/api/useWorkspaceQueries';
import { Outlet, useParams } from 'react-router-dom';
import ErrorPage from '../pages/app/404';

export function WorkspaceGuard() {
    const params = useParams();

    const { data, isPending } = useWorkspacesQueries.verifySlug(params?.workspaceSlug ?? '');
    if(isPending) return <GlobalPageLoader isLoading={isPending}/>;
    if(!data?.verified || !params?.workspaceSlug) {
        return (
            <ErrorPage 
                redirectTo="/workspaces"
                redirectLabel='Workspaces'
            />
        );
    }
    return <Outlet />;
}