import { GlobalPageLoader } from "@/components/ui/feedback/Loaders";
import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../hooks";

export function GuestGuard() {
    const { data, isPending, isError } = useMe();
    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if (isError || !data) return <Outlet />
    const workspceSlug = window.localStorage.getItem('workspace_slug')
    const redirectPath = workspceSlug ? `/${workspceSlug}/dashboard` : '/workspaces';
    return <Navigate to={redirectPath} replace />;
}