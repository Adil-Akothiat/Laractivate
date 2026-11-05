import { useCan } from "./useCan";
import { Bell, Folder, LayoutDashboard, Settings, UserGroup, UserKey, Users } from "lucide-react";
import { system, client } from "@/app/config/permissions.json";

export const useNavLinks = ()=> {
    const { canAny, can } = useCan();
    const workspaceSlug = window.localStorage.getItem('workspace_slug') ?? 'any';
    return [
        {
            section: "Workspace",
            show: canAny(client.all),
            items: [
                {
                    label: "Dashboard",
                    href: `/${workspaceSlug}/dashboard`,
                    icon: <LayoutDashboard size={16} />,
                    show: can(client.dashboard.view),
                },
                {
                    label: "Members",
                    href: `/${workspaceSlug}/members`,
                    icon: <UserGroup size={16} />,
                    show: canAny([client.members.view, client.members.manage]),
                },
                {
                    label: "Workspaces",
                    href: "/workspaces",
                    icon: <Folder size={16} />,
                    show: canAny([client.workspaces.view, client.workspaces.manage])
                },
                {
                    label: "Roles & Permissions",
                    href: `${workspaceSlug}/roles-permissions`,
                    icon: <Folder size={16} />,
                    show: canAny([client.roles.view, client.roles.manage])
                },
            ],
        },
        {
            section: "System",
            show: canAny(system.all),
            items: [
                { 
                    label: "Accounts", 
                    href: "/accounts", 
                    icon: <Users size={16} />,
                    show: canAny([system.accounts.view, system.accounts.manage]) 
                },
                { 
                    label: "System Roles", 
                    href: "/roles-permissions", 
                    icon: <UserKey size={16} />,
                    show: canAny([system.roles.view, system.roles.manage])
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
                },
                {
                    label: "Notifications",
                    href: "/notifications",
                    icon: <Bell size={16} />,
                    show: true
                },
            ]
        },
    ];
}