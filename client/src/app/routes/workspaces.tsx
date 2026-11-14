import { client } from "@/app/config/permissions.json";
import PermissionGuard from "@/app/guards/PermissionGuard";
import { WorkspaceGuard } from "@/app/guards/WorkspaceGuard";
import UserPricingPage from "@/pages/workspaces/billing/UserPricingPage";
import InvoicePage from "@/pages/workspaces/dashboard-pending/InvoicePage";
import MembersPage from "@/pages/workspaces/members/MembersPage";
import WorkspacesPage from "@/pages/workspaces/WorkspacesPage";
import { Route } from "react-router-dom";

export default function WorkspacesRoutes() {
    return (
        <>
            <Route path="/workspaces" element={<WorkspacesPage />} />
            <Route path="/:workspaceSlug" element={<WorkspaceGuard />}>
                <Route
                    path="dashboard"
                    element={
                        <PermissionGuard permission={client.dashboard.view}>
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
                <Route path="roles-permissions" element={<h1>Workspace roles&permissions managements</h1>} />
            </Route>
        </>
    );
}