import AuthBanner from "@/features/public/components/Auth/AuthBanner";
import ForgotPasswordForm from "@/features/public/components/Auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner variant="forgot-password" />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}