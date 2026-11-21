import { getErrorsMessages } from "@/app/utils";
import { Alert, Button, Input } from "@/components";
import { FormControl } from "@/components/ui/forms/FormControls";
import { Link } from "react-router-dom";
import { useLoginForm } from "../model/useLoginForm";
import { LoginTfaVerification } from "./LoginTfaVerification";

export function LoginForm() {
    const { loginMutation, setValue, form, handleSubmit } = useLoginForm();
    const { isError, error, isPending } = loginMutation;

    return (
        <>
            {form.show2FA && (
                <LoginTfaVerification
                    token={form.token}
                    onCancel={() => setValue("show2FA", false)}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
                {isError && getErrorsMessages(error).map((msg: string, i: number) => (
                    <Alert key={i} variant="error" message={msg} className="mb-6" />
                ))}
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
        </>
    );
}