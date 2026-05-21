import { Menu, ShieldIcon } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";
import { imageRender } from "../../utils/imagePreviewHandler";
import { useNavigate } from "react-router-dom";
import NotificationBell from "@/features/base/notifications/components/NotificationBell";
import type { UserSchema } from "@/features/base/shared/types";

type Props = {
    setDrawerOpen:(open:boolean)=>void;
    setIsLogoutModalOpen:(open:boolean)=>void;
    user:UserSchema;
}
export default function PageHeader({ setDrawerOpen, setIsLogoutModalOpen, user }:Props) {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between md:justify-end gap-3 px-4 py-3 bg-base-100 border-b border-base-300 sticky top-0 z-30">
            <div className="flex gap-3 md:hidden">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="btn btn-ghost btn-sm btn-circle"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-primary rounded-lg p-1">
                        <ShieldIcon
                            size={14}
                            className="text-primary-content"
                        />
                    </div>
                    <span className="font-bold text-base-content text-sm">
                        AuthPanel
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <NotificationBell />
                <ProfileDropdown
                    name={user?.first_name + ' ' + user?.last_name}
                    email={user?.email || ""}
                    avatar={imageRender(user?.avatar)}
                    onProfile={() => navigate("/settings/profile")}
                    onLogout={() => setIsLogoutModalOpen(true)}
                />
            </div>
        </div>
    );
}