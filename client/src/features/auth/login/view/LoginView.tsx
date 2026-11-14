import { Link } from "react-router-dom";
import { LoginForm } from "../ui";

export function LoginView() {
    return (
        <div className="w-full max-w-sm mx-auto px-6 py-8">
            {/* Heading - Increased spacing below title */}
            <div className="mb-10 text-left">
                <h1 className="text-2xl font-bold text-base-content">Welcome back</h1>
                <p className="text-sm text-base-content/60 mt-2">Sign in to your account to continue</p>
            </div>
            <LoginForm />
            <div className="divider my-8 text-xs text-base-content/40 uppercase tracking-widest">or</div>

            <p className="text-sm text-center text-base-content/70">
                Don't have an account?{" "}
                <Link to="/register" className="text-secondary font-bold hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}