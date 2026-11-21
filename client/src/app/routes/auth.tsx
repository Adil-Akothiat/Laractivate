import { ResetPasswordGuard } from "@/app/guards/ResetPasswordGuard";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "@/pages/auth";
import { Route } from "react-router-dom";
import { GuestGuard } from "../guards";

export default function AuthRoutes() {
    return (
        <>
            <Route element={<GuestGuard />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ResetPasswordGuard />}>
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
        </>
    );
}