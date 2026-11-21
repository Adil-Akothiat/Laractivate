import { GlobalPageLoader } from '@/components/ui/feedback/Loaders';
import { useWorkspacesQueries } from '@/features/workspace/manageWorkspaces/hooks/api/useWorkspaceQueries';
import { Outlet, useParams } from 'react-router-dom';
import ErrorPage from '../../pages/public/404';

export function WorkspaceGuard() {
    const params = useParams();
    const workspaceSlug = params?.workspaceSlug || window.localStorage.getItem('workspace_slug') || "";
    const { data, isPending, isError } = useWorkspacesQueries.verifySlug(workspaceSlug);
    if (isPending) return <GlobalPageLoader isLoading={isPending} />;

    if (isError || !data) {
        window.localStorage.removeItem('workspace_slug');
        return (
            <ErrorPage
                redirectTo='/workspaces'
                redirectLabel='Workspaces'
            />
        );
    }

    if (data.verified) {
        return <Outlet />;
    }

    if (data?.redirect_path) {
        if (data?.redirect_path !== "/workspaces") {
            window.localStorage.setItem('workspace_slug', data.redirect_path.split("/")[1]);
        }
        return (
            <ErrorPage
                redirectTo={data.redirect_path}
                redirectLabel={data.redirect_path === "/workspaces" ? "Workspaces" : "Dashboard"}
            />
        );
    }

}