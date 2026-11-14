import { Link } from "react-router-dom";
import { RegisterForm } from "../ui";

export function RegisterView() {
    return (
        <div className="w-full max-w-sm mx-auto px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-base-content/60 mt-2">
                    Get started with your 14-day free trial.
                </p>
            </div>
            <RegisterForm />
            <div className="divider my-8 text-[10px] text-base-content/30 uppercase tracking-[0.2em]">
                OR
            </div>

            <p className="text-sm text-center text-base-content/70">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}