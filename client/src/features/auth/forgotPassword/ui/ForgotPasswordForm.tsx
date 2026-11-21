import { Button, Input } from "@/components";
import { FormControl } from "@/components/ui/forms/FormControls";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../api";

export function ForgotPasswordForm() {
    const { mutate, isPending } = useForgotPasswordMutation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(email, {
            onSuccess: () => {
                navigate('/login');
            }
        });
    };

    return (
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
    );
}