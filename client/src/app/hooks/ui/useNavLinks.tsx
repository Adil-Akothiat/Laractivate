import { APP_PERMISSIONS } from "@/app/constants/appPermissions";
import { useCan } from "./useCan";
import { Bell, Folder, LayoutDashboard, Settings, UserGroup, UserKey, Users } from "lucide-react";

export const useNavLinks = ()=> {
    const { canAny } = useCan();
    return [
        {
            section: "Overview",
            show: canAny(APP_PERMISSIONS.dashboard),
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: <LayoutDashboard size={16} />,
                    show: canAny(APP_PERMISSIONS.dashboard),
                },
                {
                    label: "Notifications",
                    href: "/notifications",
                    icon: <Bell size={16} />,
                    show: canAny(APP_PERMISSIONS.dashboard)
                },
            ],
        },
        {
            section: "Workspace",
            show: canAny(APP_PERMISSIONS.dashboard),
            items: [
                {
                    label: "Members",
                    href: "/members",
                    icon: <UserGroup size={16} />,
                    show: canAny(APP_PERMISSIONS.dashboard),
                },
                {
                    label: "Workspaces",
                    href: "/workspaces",
                    icon: <Folder size={16} />,
                    show: canAny(APP_PERMISSIONS.dashboard)
                },
            ],
        },
        {
            section: "System",
            show: canAny([...APP_PERMISSIONS.accounts, ...APP_PERMISSIONS.roles]),
            items: [
                { 
                    label: "Accounts", 
                    href: "/accounts", 
                    icon: <Users size={16} />,
                    show: canAny(APP_PERMISSIONS.accounts) 
                },
                { 
                    label: "Roles & Permissions", 
                    href: "/roles-permissions", 
                    icon: <UserKey size={16} />,
                    show: canAny(APP_PERMISSIONS.roles)
                },
            ],
        },
        {
            section: "General",
            show: true,
            items: [
                {
                    label: "Settings",
                    href: "/settings",
                    icon: <Settings size={16} />,
                    show: true,
                }
            ],
        },
    ];
}