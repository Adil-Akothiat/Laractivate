import AuthBanner from "@/features/public/components/Auth/AuthBanner";
import ResetPasswordForm from "@/features/public/components/Auth/ResetPasswordForm";


export default function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner variant="reset-password" />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <ResetPasswordForm />
            </div>
        </div>
    );
}