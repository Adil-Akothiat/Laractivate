import { GlobalPageLoader } from "@/components/ui/feedback/Loaders";
import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../hooks";

export default function AuthGuard() {
    const { data, isPending, isError } = useMe();
    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if (isError || !data) return <Navigate to="/login" replace />;
    return <Outlet />
}