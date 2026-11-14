import { getErrorsMessages } from "@/app/utils";
import { Alert, Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import { useRegisterForm } from "../model";

export function RegisterForm() {
    const { registerMutation, handleSubmit, form, setValue } = useRegisterForm();
    const { isError, error, isPending } = registerMutation;
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isError && getErrorsMessages(error).map((msg: string, i: number) => (
                <Alert key={i} variant="error" message={msg} className="mb-6" />
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormControl className="">
                    <Input
                        label="First name"
                        type="text"
                        placeholder="Mohamed"
                        value={form.first_name}
                        onChange={(e) => setValue("firstName", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/40 h-11"
                    />
                </FormControl>
                <FormControl>
                    <Input
                        label="Last name"
                        type="text"
                        placeholder="Ali"
                        value={form.last_name}
                        onChange={(e) => setValue("lastName", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/40 h-11"
                    />
                </FormControl>
            </div>

            <FormControl>
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setValue("email", e.target.value)}
                    disabled={isPending}
                    required
                    className="bg-base-200/40 h-11"
                />
            </FormControl>

            {/* Grid layout reduces vertical height significantly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormControl>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setValue("password", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/40 h-11"
                    />
                </FormControl>

                <FormControl>
                    <Input
                        label="Confirm"
                        type="password"
                        placeholder="••••••••"
                        value={form.password_confirmation}
                        onChange={(e) => setValue("passwordConfirmation", e.target.value)}
                        disabled={isPending}
                        required
                        className="bg-base-200/40 h-11"
                    />
                </FormControl>
            </div>

            <div className="pt-2">
                <Button
                    className="w-full"
                    type="submit"
                    loading={isPending}
                    loadingText="Sign Up..."
                >
                    Create Account
                </Button>
            </div>
        </form>
    );
}