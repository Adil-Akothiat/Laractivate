import { ShieldIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavLinks } from "@/app/hooks/ui/useNavLinks";
import { WorkspacesManager } from "@/features/base/workspaces/components/Manage";

export default function SidebarContent() {
    const navLinks = useNavLinks();

    return (
        <>
            <div className="px-4 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-primary rounded-lg p-1.5">
                        <ShieldIcon
                            size={16}
                            className="text-primary-content"
                        />
                    </div>
                    <span className="font-bold text-base-content text-sm">
                        AuthPanel
                    </span>
                </div>
            </div>
            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
                <WorkspacesManager />
                {navLinks
                    .filter((group) => group.show === true || group.show)
                    .map((group) => (
                        <div key={group.section}>
                            <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider px-2 mb-1.5">
                                {group.section}
                            </p>
                            <ul className="space-y-0.5">
                                {group.items
                                    .filter((item) => item.show === true || item.show)
                                    .map((item) => (
                                        <li key={item.label}>
                                            <NavLink
                                                to={item.href}
                                                className={({ isActive }) =>
                                                    isActive
                                                        ? "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150 bg-primary/10 text-primary"
                                                        : "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-base-content/60 hover:bg-base-200 hover:text-base-content"
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <span
                                                            className={
                                                                isActive
                                                                    ? "text-primary"
                                                                    : "text-base-content/40"
                                                            }
                                                        >
                                                            {item.icon}
                                                        </span>
                                                        {item.label}
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}
            </nav>
        </>
    );
}