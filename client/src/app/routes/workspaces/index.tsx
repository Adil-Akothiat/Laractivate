import PermissionGuard from "@/app/middlewares/PermissionGuard";
import { WorkspaceGuard } from "@/app/middlewares/WorkspaceGuard";
import UserPricingPage from "@/app/pages/base/billing/UserPricingPage";
import InvoicePage from "@/app/pages/base/dashboard/InvoicePage";
import MembersPage from "@/app/pages/base/members/MembersPage";
import WorkspacesPage from "@/app/pages/base/workspaces/WorkspacesPage";
import { Route } from "react-router-dom";

export default function WorkspacesRoutes() {
    return (
        <Route path="/workspaces">
            <Route index element={<h1>Workspaces here</h1>} />
            <Route path=":workspaceSlug" element={<WorkspaceGuard />}>
                <Route index element={<WorkspacesPage />} />
                <Route
                    path="dashboard"
                    element={
                        <PermissionGuard permission={['all', 'client.dashboard.view']}>
                            <h2>Worksapce dashboard</h2>
                        </PermissionGuard>
                    }
                />
                <Route
                    path="pricing"
                    element={
                        <PermissionGuard permission={['all', 'client.billing.view', 'client.billing.manage']}>
                            <UserPricingPage />
                        </PermissionGuard>
                    }
                />
                <Route
                    path="invoices"
                    element={
                        <PermissionGuard permission={['all', 'client.billing.view', 'client.billing.manage']}>
                            <InvoicePage />
                        </PermissionGuard>
                    }
                />
                <Route path="members" element={<MembersPage />} />
            </Route>
        </Route>
    );
}