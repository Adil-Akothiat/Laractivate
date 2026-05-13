import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/base/auth/hooks/useAuth";
import { getErrorsMessages } from "@/app/utils";
import { Alert, Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import TwoFactorDialog from "../../shared/components/2FA/TwoFactorDialog";

export default function LoginForm() {
    const { mutate, isPending, isError, error } = useAuth.login();
    const [form, setForm] = useState({
        email: "",
        password: "",
        show2FA: false as boolean,
        userId: null as string | null,
        token:""
    });

    const setValue = (key: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            { email: form.email, password: form.password },
            {
                onSuccess: (res) => {
                    if (res?.data?.next === "2FA_VERIFICATION") {
                        const { id, challenge_token } = res.data;
                        setForm((prev) => ({ ...prev, show2FA: true, userId: id, token:challenge_token }));
                        return;
                    }
                    setTimeout(() => { window.location.href = "/dashboard"; }, 0);
                },
            },
        );
    };
    return (
        <div className="w-full max-w-sm mx-auto px-6 py-8">
            {form.show2FA && (
                <TwoFactorDialog
                    userId={form.userId}
                    token={form.token}
                    onSuccess={() => (window.location.href = "/dashboard")}
                    onCancel={() => setValue("show2FA", false)}
                />
            )}
            {/* Heading - Increased spacing below title */}
            <div className="mb-10 text-left">
                <h1 className="text-2xl font-bold text-base-content">Welcome back</h1>
                <p className="text-sm text-base-content/60 mt-2">Sign in to your account to continue</p>
            </div>

            {isError && getErrorsMessages(error).map((msg: string, i: number) => (
                <Alert key={i} variant="error" message={msg} className="mb-6" />
            ))}

            <form onSubmit={handleSubmit} className="space-y-5">
                <FormControl>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setValue("email", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/50"
                    />
                </FormControl>

                <FormControl>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium">Password</label>
                        <Link to="/forgot-password" className="text-xs link link-primary no-underline hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setValue("password", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/50"
                    />
                </FormControl>
                <Button
                    type="submit"
                    loading={isPending}
                    loadingText="Sign In..."
                    className="w-full"
                >
                    Sign In
                </Button>
            </form>
            {/* Refined Divider - Smaller margin */}
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