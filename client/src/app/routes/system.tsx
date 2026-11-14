import PermissionGuard from "@/app/guards/PermissionGuard";
import AccountDetailsPage from "@/pages/system/accounts/AccountDetailsPage";
import { AccountsPage } from "@/pages/system/accounts/AccountsPage";
import RolesPermissionsPage from "@/pages/system/RolesPermissionsPage";
import { Route } from "react-router-dom";

export default function SystemRoutes() {
    return (
        <Route path="/system">
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
                    <PermissionGuard permission={["all", "system.accounts.manage"]}>
                        <AccountDetailsPage />
                    </PermissionGuard>
                }
            />
            <Route
                path="roles-permissions"
                element={
                    <PermissionGuard permission={["all", "system.roles.view", "system.roles.manage"]}>
                        <RolesPermissionsPage />
                    </PermissionGuard>
                }
            />
        </Route>
    );
}