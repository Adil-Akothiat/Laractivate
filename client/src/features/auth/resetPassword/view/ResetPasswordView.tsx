import { ResetPasswordForm } from "../ui/ResetPasswordForm";

export function ResetPasswordView() {
    return (
        <div className="w-full max-w-sm mx-auto px-6">
            <div className="mb-8">
                <h1 className="text-xl font-medium text-base-content">Set a new password</h1>
                <p className="text-sm text-base-content/50 mt-1">Choose something strong you haven't used before</p>
            </div>
            <ResetPasswordForm />
        </div>
    );
}