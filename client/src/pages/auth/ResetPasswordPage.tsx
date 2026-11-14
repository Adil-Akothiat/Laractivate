import { ResetPasswordView } from "@/features/auth/resetPassword";
import { AuthBanner } from "./layouts/AuthBanner";

export function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner variant="reset-password" />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <ResetPasswordView />
            </div>
        </div>
    );
}