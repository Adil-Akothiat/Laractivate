import { getLocalWorkspaceSlug } from "@/app/utils";
import { Breadcrumb, ScrollContainer } from "@/components";
import { LayoutDashboard, UserKey } from "lucide-react";
import { useLocation } from "react-router-dom";
import { WorkspaceRoleContextProvider } from "../model";
import { ManageWorkspaceRoles } from "../ui/ManageWorkspaceRoles";

export function WorkspaceRolesView() {
    const workspaceId = getLocalWorkspaceSlug();
    const location = useLocation();

    return (
        <WorkspaceRoleContextProvider>
            <ScrollContainer>
                <Breadcrumb
                    items={[
                        { label: "Dashboard", href: `/${workspaceId}/dashboard`, icon: <LayoutDashboard size={16} /> },
                        { label: "Roles & Permissions", href: location.pathname, icon: <UserKey size={16} /> },
                    ]}
                />
                <ManageWorkspaceRoles />
            </ScrollContainer>
        </WorkspaceRoleContextProvider>
    );
}