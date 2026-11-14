import { ResetPasswordGuard } from "@/app/guards/ResetPasswordGuard";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "@/pages/auth";
import { Route } from "react-router-dom";

export default function AuthRoutes() {
    return (
        <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ResetPasswordGuard />}>
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
        </>
    );
}