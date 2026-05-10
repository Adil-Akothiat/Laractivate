import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useToastContext } from "../hooks/useToastContext";

import Sidebar from "../layouts/Sidebar";
import AuthGuard from "../middlewares/AuthGuard";
import PermissionGuard from "../middlewares/PermissionGuard";

import Dashboard from "../../features/base/dashboard";
import ActivityLogs from "../../features/base/settings/components/ActivityLogs/ActivityLogs";
import Notification from "../../features/base/notifications";
import LoginPage from "../pages/base/auth/LoginPage";
import RegisterPage from "../pages/base/auth/RegisterPage";
import ResetPasswordPage from "../pages/base/auth/ResetPasswordPage";
import ForgotPasswordPage from "../pages/base/auth/ForgotPasswordPage";
import ForbiddenPage from "../pages/app/403";
import NotFoundPage from "../pages/app/404";
import { AccountsPage } from "../pages/base/accounts/AccountsPage";
import AccessControlPage from "../pages/base/rbac/AccessControlPage";
import MiniSidebar from "../../features/base/settings/components/Shared/MiniSidebar";
import TwoFactorAuth from "../../features/base/settings/components/2FA/TwoFactorAuth";
import ProfilePage from "../pages/base/settings/ProfilePage";
import ChangePasswordPage from "../pages/base/settings/ChangePasswordPage";
import SessionsPage from "../pages/base/settings/SessionsPage";
import { APP_PERMISSIONS } from "../constants/appPermissions";
import AccountDetailsPage from "../pages/base/accounts/AccountDetailsPage";
import { ResetPasswordGuard } from "../middlewares/ResetPasswordGuard";

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
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route element={<ResetPasswordGuard />}>
                <Route path="/reset-password" element={
                    <ResetPasswordPage />
                } />
                </Route>
                <Route path="/403" element={<ForbiddenPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route element={<AuthGuard />}>
                    <Route element={<Sidebar />}>
                        <Route
                            path="/dashboard"
                            element={
                                <PermissionGuard
                                    permission={APP_PERMISSIONS.dashboard}
                                >
                                    <Dashboard />
                                </PermissionGuard>
                            }
                        />

                        <Route
                            path="/notifications"
                            element={<Notification />}
                        />
                        <Route
                            path="/accounts"
                            element={
                                <PermissionGuard
                                    permission={APP_PERMISSIONS.accounts}
                                >
                                    <AccountsPage />
                                </PermissionGuard>
                            }
                        />
                        <Route
                            path="/accounts/:id"
                            element={
                                <PermissionGuard
                                    permission={[
                                        "all",
                                        "accounts.manage"
                                    ]}
                                >
                                    <AccountDetailsPage />
                                </PermissionGuard>
                            }
                        />
                        <Route
                            path="/roles-permissions"
                            element={
                                <PermissionGuard
                                    permission={APP_PERMISSIONS.roles}
                                >
                                    <AccessControlPage />
                                </PermissionGuard>
                            }
                        />
                        <Route path="/settings" element={<MiniSidebar />}>
                            <Route
                                index
                                element={<Navigate to="profile" replace />}
                            />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route
                                path="password"
                                element={<ChangePasswordPage />}
                            />
                            <Route
                                path="two-factor"
                                element={<TwoFactorAuth />}
                            />
                            <Route path="sessions" element={<SessionsPage />} />
                            <Route
                                path="activity-logs"
                                element={<ActivityLogs />}
                            />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
