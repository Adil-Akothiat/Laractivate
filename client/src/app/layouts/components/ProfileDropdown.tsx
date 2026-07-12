import { useRef, useEffect, useState } from "react";
import {
    LogOut,
    HelpCircle,
    Settings,
} from "lucide-react";
import Avatar from "@/components/Avatar";

interface ProfileDropdownProps {
    name: string;
    email: string;
    avatar?: string | null;
    onProfile: () => void;
    onLogout: () => void;
}

export function ProfileDropdown({
    name,
    email,
    avatar,
    onProfile,
    onLogout,
}: ProfileDropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    const menuItems = [
        { icon: <Settings size={14} />,   label: "Settings",     action: onProfile },
        { icon: <HelpCircle size={14} />, label: "Help & Support", action: () => {} },
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
            >
                {/* Avatar */}
                <Avatar
                    src={avatar ?? undefined}
                    initials={initials}
                    size="sm"
                    shape="circle"
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* User info header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-base-200 bg-base-200/50">
                        <Avatar
                            src={avatar ?? undefined}
                            initials={initials}
                            size="sm"
                            shape="circle"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-base-content truncate">
                                {name}
                            </p>
                            <p className="text-xs text-base-content/40 truncate">
                                {email}
                            </p>
                        </div>
                    </div>

                    {/* Menu items */}
                    <ul className="py-1">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                <button
                                    onClick={() => {
                                        item.action();
                                        setOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors"
                                >
                                    <span className="text-base-content/40">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Logout */}
                    <div className="border-t border-base-200 py-1">
                        <button
                            onClick={() => {
                                onLogout();
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                        >
                            <LogOut size={14} />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}