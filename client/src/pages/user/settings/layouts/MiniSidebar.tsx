import { Button } from "@/components";
import { ScrollContainer } from "@/components";
import {
    ChevronDown,
    FingerprintPattern,
    Logs,
    RectangleEllipsis,
    ShieldCheck,
    SunMoon,
    User,
    UserKey,
    UserX,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export type SidebarItem = {
    label: string;
    icon: React.ReactNode;
    path: string;
    children?: SidebarItem[];
};

export const sidebarItems: SidebarItem[] = [
    {
        label: "Profile",
        icon: <User size={18} />,
        path: "/settings/profile",
    },
    {
        label: "Security",
        icon: <ShieldCheck size={18} />,
        path: "/settings/security",
        children: [
            { label: "Password", icon: <RectangleEllipsis size={18} />, path: "/settings/security/password" },
            { label: "2FA", icon: <FingerprintPattern size={18} />, path: "/settings/security/two-factor" },
            { label: "Sessions", icon: <UserKey size={18} />, path: "/settings/security/sessions" },
            { label: "Activity logs", icon: <Logs size={18} />, path: "/settings/security/activity-logs" },
            { label: "DangerZone", icon: <UserX size={18} />, path: "/settings/security/danger-zone" },
        ],
    },
    {
        label: "Appearance",
        icon: <SunMoon size={18} />,
        path: "/settings/appearance",
    },
];

const baseLink = "mb-2 flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150";
const activeLink = `${baseLink} bg-primary/10 text-primary`;
const idleLink = `${baseLink} text-base-content/60 hover:bg-base-200 hover:text-base-content`;

function SidebarLink({ item, expand }: { item: SidebarItem; expand: boolean }) {
    return (
        <NavLink to={item.path} className={({ isActive }) => (isActive ? activeLink : idleLink)}>
            <span className="shrink-0">{item.icon}</span>
            <span className={expand ? "hidden md:inline truncate" : "hidden"}>{item.label}</span>
        </NavLink>
    );
}

export function MiniSidebar() {
    const [expand, setExpand] = useState<boolean>(true);
    // Only stores groups the user toggled manually; otherwise the URL decides
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const { pathname } = useLocation();

    return (
        <div className=" h-32 bg-base-100">
            <div className="flex">
                <aside
                    className={`w-14 ${expand ? "md:w-52" : ""} shrink-0 bg-base-100 border-r border-base-300 flex flex-col py-3 transition-all duration-300 h-screen px-3 relative`}
                >
                    <Button
                        onClick={() => setExpand(!expand)}
                        size="xs"
                        circle
                        variant="default"
                        className="hidden md:block absolute -right-4"
                    >
                        {expand ? "<" : ">"}
                    </Button>

                    {sidebarItems.map((item) => {
                        if (!item.children) {
                            return <SidebarLink key={item.path} item={item} expand={expand} />;
                        }

                        const sectionActive = pathname.startsWith(item.path);
                        const isOpen = openGroups[item.path] ?? sectionActive;

                        return (
                            <div key={item.path}>
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() =>
                                        setOpenGroups((prev) => ({ ...prev, [item.path]: !isOpen }))
                                    }
                                    className={`${baseLink} w-full ${sectionActive
                                        ? "text-primary"
                                        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                                        }`}
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    <span className={expand ? "hidden md:inline truncate flex-1 text-left" : "hidden"}>
                                        {item.label}
                                    </span>
                                    {expand && (
                                        <ChevronDown
                                            size={16}
                                            className={`hidden md:block shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className={expand ? "md:ml-4 md:pl-2 md:border-l md:border-base-300" : ""}>
                                        {item.children.map((child) => (
                                            <SidebarLink key={child.path} item={child} expand={expand} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </aside>

                <div className="w-full bg-white">
                    <ScrollContainer>
                        <Outlet />
                    </ScrollContainer>
                </div>
            </div>
        </div>
    );
}