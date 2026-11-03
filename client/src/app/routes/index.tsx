import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useToastContext } from "../hooks/common";
import PublicRoutes from "./public";
import AuthGuard from "../middlewares/AuthGuard";
import Sidebar from "../layouts/Sidebar";
import UserRoutes from "./user";
import SystemRoutes from "./system";
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