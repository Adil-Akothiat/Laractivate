import { NavLink, Outlet } from "react-router-dom";
import { User, RectangleEllipsis, FingerprintPattern, UserKey, Logs } from "lucide-react";
import { ScrollContainer } from "@/components/ScrollContainer";
import { useState } from "react";
import { Button } from "@/components";

export type SidebarItem = {
    label: string;
    icon: React.ReactNode;
    path: string;
};

export const sidebarItems: SidebarItem[] = [
    {
        label: "Profile",
        icon: <User size={18} />,
        path: "/settings/profile"
    },
    {
        label: "Password",
        icon: <RectangleEllipsis size={18} />,
        path: "/settings/password"
    },
    {
        label: "2FA",
        icon: <FingerprintPattern size={18} />,
        path: "/settings/two-factor"
    },
    {
        label: "Sessions",
        icon: <UserKey size={18} />,
        path: "/settings/sessions"
    },
    {
        label: "Activity logs",
        icon: <Logs size={18} />,
        path: "/settings/activity-logs"
    },
];

export default function MiniSidebar() {
    const [expand, setExpand] = useState<boolean>(true);
    return (
        <div className=" h-32 bg-base-100">
            <div className="flex">
                <aside
                    className={`w-14 ${expand ? "md:w-52" : ""} shrink-0 bg-base-100 border-r border-base-300 flex flex-col py-3 transition-all duration-300 h-screen px-3 relative`}
                > 
                    <Button 
                        onClick={()=> setExpand(!expand)}
                        size="xs"
                        circle
                        variant="default"
                        className="hidden md:block absolute -right-4"
                    >
                        {expand?"<":">"}
                    </Button>
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={
                        ({ isActive }) => isActive ?"mb-2 flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150 bg-primary/10 text-primary"
                        : "mb-2 flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-base-content/60 hover:bg-base-200 hover:text-base-content"
                      }
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="hidden md:inline truncate">
                                {item.label}
                            </span>
                        </NavLink>
                    ))}
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