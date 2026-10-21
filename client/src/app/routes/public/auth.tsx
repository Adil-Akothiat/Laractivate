import { ResetPasswordGuard } from "@/app/middlewares/ResetPasswordGuard";
import ForgotPasswordPage from "@/app/pages/public/auth/ForgotPasswordPage";
import LoginPage from "@/app/pages/public/auth/LoginPage";
import RegisterPage from "@/app/pages/public/auth/RegisterPage";
import ResetPasswordPage from "@/app/pages/public/auth/ResetPasswordPage";
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