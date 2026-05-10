import { Navigate, Outlet } from "react-router-dom";
import { GlobalPageLoader } from "../../components/Loaders";
import { useMe } from "./hooks/useMe";

export default function AuthGuard() {
    const { data, isPending, isError } = useMe();
    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if(isError || !data) return <Navigate to="/login" replace />;
    return <Outlet />
}