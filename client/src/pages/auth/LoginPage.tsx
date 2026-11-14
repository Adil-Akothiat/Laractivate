import { LoginView } from "@/features/auth/login";
import { AuthBanner } from "./layouts/AuthBanner";

export function LoginPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner
                variant="login"
            />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <LoginView />
            </div>
        </div>
    );
}