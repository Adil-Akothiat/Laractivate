import { ForgotPasswordView } from "@/features/auth/forgotPassword";
import { AuthBanner } from "./layouts/AuthBanner";

export function ForgotPasswordPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner variant="forgot-password" />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <ForgotPasswordView />
            </div>
        </div>
    );
}