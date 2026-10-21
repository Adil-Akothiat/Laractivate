import { BrowserRouter, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useToastContext } from "../hooks/common";
import PublicRoutes from "./public";
import SystemRoutes from "./system";
import UserRoutes from "./user";
import WorkspaceRoutes from "./workspace";

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
                {UserRoutes()}
                {SystemRoutes()}
                {WorkspaceRoutes()}
            </Routes>
        </BrowserRouter>
    );
}

export default App;