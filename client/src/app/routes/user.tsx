import { ActivityLogsPage, AppearanePage, ChangePasswordPage, DangerZonePage, MiniSidebar, NotificationsPage, ProfilePage, SessionsPage, TwoFactorAuthPage } from "@/pages/user";
import { Navigate, Route } from "react-router-dom";

export default function UserRoutes() {
    return (
        <>
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* Settings */}
            <Route path="/settings" element={<MiniSidebar />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path='security'>
                    <Route path="password" element={<ChangePasswordPage />} />
                    <Route path="two-factor" element={<TwoFactorAuthPage />} />
                    <Route path="sessions" element={<SessionsPage />} />
                    <Route path="activity-logs" element={<ActivityLogsPage />} />
                    <Route path="danger-zone" element={<DangerZonePage />} />
                    <Route path="appearance" element={<AppearanePage />} />
                </Route>
                <Route path="appearance" element={<h1>Appearance Light.Dark (comming soon)</h1>} />
            </Route>
            <Route path="/invitations/process" element={<h1>Process invitations</h1>} />
        </>
    );
}