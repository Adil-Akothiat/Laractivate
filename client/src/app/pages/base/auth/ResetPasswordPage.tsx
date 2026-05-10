import { ResetPasswordForm } from "../../../../features/base/auth";
import AuthBanner from "../../../../features/base/auth/components/shared/AuthBanner";

export default function ForgotPasswordPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner variant="reset-password" />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <ResetPasswordForm />
            </div>
        </div>
    );
}