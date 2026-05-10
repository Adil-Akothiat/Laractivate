import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorsMessages } from "../../../../app/utils";
import { Button, Input } from "../../../../components";
import { FormControl } from "../../../../components/FormControls";
import { useToastContext } from "../../../../app/hooks/useToastContext";

export default function ResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const [token, email] = [searchParams.get('token'), searchParams.get('email')];
    const { toast } = useToastContext();
    const navigate = useNavigate();

    const { mutate, isPending } = useAuth.resetPassword();
    const [form, setForm] = useState({
        password:             "",
        passwordConfirmation: "",
    });
    const setValue = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            {
                email:                 email||'',
                token:                 token || '',
                password:              form.password,
                password_confirmation: form.passwordConfirmation,
            },
            {
                onSuccess: () => {
                    toast.success('Password resetted successfully!');
                    navigate('/login');
                },
                onError: (err:any)=> {
                    const message = getErrorsMessages(err);
                    toast.error(message.join('|'));
                }
            },
        );
    };

    return (
        <div className="w-full max-w-sm mx-auto px-6">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-xl font-medium text-base-content">Set a new password</h1>
                <p className="text-sm text-base-content/50 mt-1">Choose something strong you haven't used before</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormControl>
                    <Input
                        label="Email(read-only)"
                        type="email"
                        placeholder="you@example.com"
                        value={email||''}
                        readOnly
                        onChange={(e) => setValue("email", e.target.value)}
                        disabled={isPending}
                        required
                    />
                </FormControl>
                <FormControl>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setValue("password", e.target.value)}
                        disabled={isPending}
                        required
                    />
                </FormControl>
                <FormControl>
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.passwordConfirmation}
                        onChange={(e) => setValue("passwordConfirmation", e.target.value)}
                        disabled={isPending}
                        required
                    />
                </FormControl>
                <Button
                    loading={isPending}
                    loadingText="Resetting..."
                    className="w-full"
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
}