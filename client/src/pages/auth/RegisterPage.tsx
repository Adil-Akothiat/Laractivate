import { RegisterView } from "@/features/auth/register";
import { AuthBanner } from "./layouts/AuthBanner";


export function RegisterPage() {
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <AuthBanner
                variant="register"
            />
            <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                <RegisterView />
            </div>
        </div>
    )
}