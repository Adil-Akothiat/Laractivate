import { GlobalPageLoader } from '@/components/Loaders/Loaders';
import { useWorkspacesQueries } from '@/features/workspace/manageWorkspaces/hooks/api/useWorkspaceQueries';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ErrorPage from '../../pages/public/404';

export function WorkspaceGuard() {
    const params = useParams();
    const workspaceSlug = params?.workspaceSlug ?? '';
    const { data, isPending, isError } = useWorkspacesQueries.verifySlug(workspaceSlug);

    useEffect(() => {
        if (data?.verified) {
            window.localStorage.setItem('workspace_slug', workspaceSlug);
        }
    }, [data?.verified, workspaceSlug]);

    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if (data?.verified === false || isError) {
        window.localStorage.removeItem('workspace_slug');
        const redirectPath = data?.redirect_path;
        return (
            <ErrorPage
                redirectTo={redirectPath}
                redirectLabel='Workspaces'
            />
        );
    }
    return <Outlet />;
}