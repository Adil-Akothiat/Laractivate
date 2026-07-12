import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getErrorsMessages } from "@/app/utils";
import { Alert, Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import { useAuthMutations } from "../hooks";

export default function RegisterForm() {
    const { register } = useAuthMutations();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName:                 "",
        lastName:                 "",
        email:                "",
        password:             "",
        passwordConfirmation: "",
    });

    const setValue = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate(
            {
                first_name:                  form.firstName,
                last_name:                  form.lastName,
                email:                 form.email,
                password:              form.password,
                password_confirmation: form.passwordConfirmation,
            },
            {
                onSuccess: () => navigate("/dashboard"),
            },
        );
    };

    return (
        <div className= "w-full max-w-sm mx-auto px-6">
            {/* Heading - Increased size and added tracking for a premium feel */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-base-content tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-base-content/60 mt-2">
                    Get started with your 14-day free trial.
                </p>
            </div>

            {register.isError && getErrorsMessages(register.error).map((msg: string, i: number) => (
                <Alert key={i} variant="error" message={msg} className="mb-6" />
            ))}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormControl className="">
                        <Input
                            label="First name"
                            type="text"
                            placeholder="Mohamed"
                            value={form.firstName}
                            onChange={(e) => setValue("firstName", e.target.value)}
                            disabled={register.isPending}
                            required
                            className="bg-base-200/40 h-11"
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            label="Last name"
                            type="text"
                            placeholder="Ali"
                            value={form.lastName}
                            onChange={(e) => setValue("lastName", e.target.value)}
                            disabled={register.isPending}
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
                        disabled={register.isPending}
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
                            disabled={register.isPending}
                            required
                            className="bg-base-200/40 h-11"
                        />
                    </FormControl>

                    <FormControl>
                        <Input
                            label="Confirm"
                            type="password"
                            placeholder="••••••••"
                            value={form.passwordConfirmation}
                            onChange={(e) => setValue("passwordConfirmation", e.target.value)}
                            disabled={register.isPending}
                            required
                            className="bg-base-200/40 h-11"
                        />
                    </FormControl>
                </div>

                <div className="pt-2">
                    <Button
                        className="w-full"
                        type="submit"
                        loading={register.isPending}
                        loadingText="Sign Up..."
                    >
                        Create Account
                    </Button>
                </div>
            </form>

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