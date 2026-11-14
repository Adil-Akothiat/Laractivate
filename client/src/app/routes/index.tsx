import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import { useToastContext } from "../hooks/common";
import Sidebar from "../layouts/Sidebar";
import AuthRoutes from "./auth";
import PublicRoutes from "./public";
import SystemRoutes from "./system";
import UserRoutes from "./user";
import WorkspacesRoutes from "./workspaces";

function App() {
    const { toast } = useToastContext();

    useEffect(() => {
        const goOnline = () => toast.success("Back online");
        const goOffline = () => toast.warning("Lost connection");
        const handleSessionExpired = () => {
            toast.error("Your session has expired. Please log in again.", {
                duration: 4000,
            });
        };

        window.addEventListener("session-expired", handleSessionExpired);
        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);

        return () => {
            window.removeEventListener("session-expired", handleSessionExpired);
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, [toast]);

    return (
        <BrowserRouter>
            <Routes>
                {PublicRoutes()}
                {AuthRoutes()}
                <Route element={<AuthGuard />}>
                    <Route element={<Sidebar />}>
                        {UserRoutes()}
                        {SystemRoutes()}
                        {WorkspacesRoutes()}
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;