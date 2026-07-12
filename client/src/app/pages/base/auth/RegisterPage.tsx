import { RegisterForm } from "@/features/base/auth";
import AuthBanner from "@/features/base/auth/components/shared/AuthBanner";

export default function RegisterPage() {
    return (
    <div className="flex h-screen w-screen overflow-hidden">
                <AuthBanner
                  variant="register"
                />
                <div className="flex-1 flex items-center justify-center bg-base-100 overflow-y-auto">
                    <RegisterForm />
                </div>
            </div>
    )
}