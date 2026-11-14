import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../ui";

export function ForgotPasswordView() {
    return (
        <div className="w-full max-w-sm mx-auto px-6">
            <div className="mb-8">
                <h1 className="text-xl font-medium text-base-content">Forgot your password?</h1>
                <p className="text-sm text-base-content/50 mt-1">Enter your email and we'll send you a reset link</p>
            </div>
            <div className="divider my-2">or</div>
            <ForgotPasswordForm />
            <p className="text-sm text-center">
                <Link to="/login" className="link link-primary">
                    Back to login
                </Link>
            </p>
        </div>
    );
}