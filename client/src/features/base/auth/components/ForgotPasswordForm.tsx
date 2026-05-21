import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import { useAuthMutations } from "../hooks";

export default function ForgotPasswordForm() {
    const { password } = useAuthMutations();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        password.forgot.mutate(email, {
            onSuccess: () => {
                navigate('/login');
            }
        });
    };

    return (
        <div className="w-full max-w-sm mx-auto px-6">
            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-xl font-medium text-base-content">Forgot your password?</h1>
                <p className="text-sm text-base-content/50 mt-1">Enter your email and we'll send you a reset link</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormControl>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={password.forgot.isPending}
                        required
                    />
                </FormControl>
                <Button
                    loadingText="Sending..."
                    loading={password.forgot.isPending}
                    className="w-full"
                >
                    Send Reset Link
                </Button>
            </form>

            <div className="divider my-2">or</div>

            <p className="text-sm text-center">
                <Link to="/login" className="link link-primary">
                    Back to login
                </Link>
            </p>
        </div>
    );
}