import { Route, Navigate } from "react-router-dom";

import Sidebar from "../../layouts/Sidebar";
import AuthGuard from "../../middlewares/AuthGuard";
import PermissionGuard from "../../middlewares/PermissionGuard";
import { ResetPasswordGuard } from "../../middlewares/ResetPasswordGuard";
import MiniSidebar from "@/features/base/settings/components/Shared/MiniSidebar";
import TwoFactorAuth from "@/features/base/settings/components/2FA/TwoFactorAuth";

import Dashboard from "@/features/base/dashboard";
import ActivityLogs from "@/features/base/settings/components/ActivityLogs/ActivityLogs";

import LoginPage from "../../pages/base/auth/LoginPage";
import RegisterPage from "../../pages/base/auth/RegisterPage";
import ForgotPasswordPage from "../../pages/base/auth/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/base/auth/ResetPasswordPage";
import { AccountsPage } from "../../pages/base/accounts/AccountsPage";
import AccountDetailsPage from "../../pages/base/accounts/AccountDetailsPage";
import AccessControlPage from "../../pages/base/rbac/AccessControlPage";
import ProfilePage from "../../pages/base/settings/ProfilePage";
import ChangePasswordPage from "../../pages/base/settings/ChangePasswordPage";
import SessionsPage from "../../pages/base/settings/SessionsPage";

import { APP_PERMISSIONS } from "../../constants/appPermissions";
import NotificationsPage from "@/app/pages/base/notifications/NotificationsPage";
import BillingPage from "@/app/pages/base/dashboard/BillingPage";

export default function baseRoutes() {
    return (
        <>
            {/* Auth */}
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ResetPasswordGuard />}>
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
            {/* Protected */}
            <Route element={<AuthGuard />}>
                <Route element={<Sidebar />}>
                    <Route
                        path="/dashboard"
                        element={
                            <PermissionGuard permission={APP_PERMISSIONS.dashboard}>
                                <Dashboard />
                            </PermissionGuard>
                        }
                    />
                    <Route
                        path="/dashboard/billing"
                        element={
                            <PermissionGuard permission={APP_PERMISSIONS.dashboard}>
                                <BillingPage />
                            </PermissionGuard>
                        }
                    />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route
                        path="/accounts"
                        element={
                            <PermissionGuard permission={APP_PERMISSIONS.accounts}>
                                <AccountsPage />
                            </PermissionGuard>
                        }
                    />
                    <Route
                        path="/accounts/:id"
                        element={
                            <PermissionGuard permission={["all", "accounts.manage"]}>
                                <AccountDetailsPage />
                            </PermissionGuard>
                        }
                    />

                    <Route
                        path="/roles-permissions"
                        element={
                            <PermissionGuard permission={APP_PERMISSIONS.roles}>
                                <AccessControlPage />
                            </PermissionGuard>
                        }
                    />
                    {/* Settings */}
                    <Route path="/settings" element={<MiniSidebar />}>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="password" element={<ChangePasswordPage />} />
                        <Route path="two-factor" element={<TwoFactorAuth />} />
                        <Route path="sessions" element={<SessionsPage />} />
                        <Route path="activity-logs" element={<ActivityLogs />} />
                    </Route>
                </Route>
            </Route>
        </>
    );
}