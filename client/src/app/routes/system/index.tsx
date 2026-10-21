import Sidebar from "@/app/layouts/Sidebar";
import AuthGuard from "@/app/middlewares/AuthGuard";
import PermissionGuard from "@/app/middlewares/PermissionGuard";
import AccountDetailsPage from "@/app/pages/base/accounts/AccountDetailsPage";
import { AccountsPage } from "@/app/pages/base/accounts/AccountsPage";
import AccessControlPage from "@/app/pages/base/rbac/AccessControlPage";
import { Route } from "react-router-dom";

export default function SystemRoutes() {
    return (
        <Route path="/system" element={<AuthGuard />}>
            <Route element={<Sidebar />}>
                {/* Removed leading slashes so they resolve to /system/dashboard, /system/accounts, etc. */}
                <Route
                    path="dashboard"
                    element={
                        <PermissionGuard permission={['all', 'system.dashboard.view']}>
                            <h2>Dashboard System</h2>
                        </PermissionGuard>
                    }
                />
                <Route
                    path="accounts"
                    element={
                        <PermissionGuard permission={['all', 'system.accounts.view']}>
                            <AccountsPage />
                        </PermissionGuard>
                    }
                />
                <Route
                    path="accounts/:id"
                    element={
                        <PermissionGuard permission={["all","system.accounts.manage"]}>
                            <AccountDetailsPage />
                        </PermissionGuard>
                    }
                />
                <Route
                    path="roles-permissions"
                    element={
                        <PermissionGuard permission={["all","system.roles.view", "system.roles.manage"]}>
                            <AccessControlPage />
                        </PermissionGuard>
                    }
                />
            </Route>
        </Route>
    );
}