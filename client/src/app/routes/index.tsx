import { BrowserRouter, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useToastContext } from "../hooks/useToastContext";
import BaseRoutes from "./base";
import AppRoutes from "./app";
import baseRoutes from "./base";
import appRoutes from "./app";

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
                {baseRoutes()}
                {appRoutes()}
            </Routes>
        </BrowserRouter>
    );
}

export default App;