import Sidebar from "@/app/layouts/Sidebar";
import AuthGuard from "@/app/middlewares/AuthGuard";
import NotificationsPage from "@/app/pages/base/notifications/NotificationsPage";
import ChangePasswordPage from "@/app/pages/base/settings/ChangePasswordPage";
import ProfilePage from "@/app/pages/base/settings/ProfilePage";
import SessionsPage from "@/app/pages/base/settings/SessionsPage";
import TwoFactorAuth from "@/features/base/settings/components/2FA/TwoFactorAuth";
import ActivityLogs from "@/features/base/settings/components/ActivityLogs/ActivityLogs";
import MiniSidebar from "@/features/base/settings/components/Shared/MiniSidebar";
import { Navigate, Route } from "react-router-dom";

export default function UserRoutes() {
    return (
        <Route element={<AuthGuard />}>
            <Route element={<Sidebar />}>

                <Route path="/notifications" element={<NotificationsPage />} />
                {/* Settings */}
                <Route path="/settings" element={<MiniSidebar />}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="password" element={<ChangePasswordPage />} />
                    <Route path="two-factor" element={<TwoFactorAuth />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="activity-logs" element={<ActivityLogs />} />
                </Route>
            </Route>
        </Route>
    );
}