import { useToastContext } from "@/app/hooks";
import { getErrorsMessagesStr } from "@/app/utils";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../api";

export function useResetPasswordForm() {
    const [searchParams] = useSearchParams();
    const [token, email] = [searchParams.get('token'), searchParams.get('email')];
    const { toast } = useToastContext();
    const navigate = useNavigate();

    const resetPasswordMutation = useResetPasswordMutation();
    const { mutate } = resetPasswordMutation;
    const [form, setForm] = useState({
        password: "",
        passwordConfirmation: "",
    });
    const setValue = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            {
                email: email || '',
                token: token || '',
                password: form.password,
                password_confirmation: form.passwordConfirmation,
            },
            {
                onSuccess: () => {
                    toast.success('Password resetted successfully!');
                    navigate('/login');
                },
                onError: (err: any) => {
                    toast.error(getErrorsMessagesStr(err));
                }
            },
        );
    };
    return {
        setValue,
        handleSubmit,
        resetPasswordMutation,
        email,
        form
    }
}