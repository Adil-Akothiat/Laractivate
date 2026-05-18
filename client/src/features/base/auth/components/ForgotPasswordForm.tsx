import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorsMessagesStr } from "@/app/utils";
import { Button, Input } from "@/components";
import { FormControl } from "@/components/FormControls";
import { useToastContext } from "@/app/hooks/common";

export default function ForgotPasswordForm() {
    const { mutate, isPending } = useAuth.forgotPassword();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const { toast } = useToastContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(email, {
            onSuccess: () => {
                toast.success('Reset link sent! Check your mail inbox!');
                navigate('/login');
            },
            onError: (err:any)=> {
                toast.error(getErrorsMessagesStr(err));  
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
                        disabled={isPending}
                        required
                    />
                </FormControl>
                <Button
                    loadingText="Sending..."
                    loading={isPending}
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