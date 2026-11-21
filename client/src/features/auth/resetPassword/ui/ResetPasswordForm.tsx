import { Button, FormControl, Input } from "@/components";
import { useResetPasswordForm } from "../model/useResetPasswordForm";

export function ResetPasswordForm() {
    const { handleSubmit, email, resetPasswordMutation, setValue, form } = useResetPasswordForm();
    const { isPending } = resetPasswordMutation;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormControl>
                <Input
                    label="Email(read-only)"
                    type="email"
                    placeholder="you@example.com"
                    value={email || ''}
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
    );
}