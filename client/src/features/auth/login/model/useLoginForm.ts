import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api";

export function useLoginForm() {
    const loginMutation = useLoginMutation();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        show2FA: false as boolean,
        userId: null as string | null,
        token: ""
    });

    const setValue = (key: string, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(
            { email: form.email, password: form.password },
            {
                onSuccess: (res) => {
                    const { data } = res.data;
                    if ('tfa' in data) {
                        const { challenge_token, id } = data.tfa;
                        setForm((prev) => ({ ...prev, show2FA: true, userId: id, token: challenge_token }));
                        return;
                    }
                    navigate(data.redirect_path);
                },
            },
        );
    };

    return {
        loginMutation,
        form,
        setValue,
        handleSubmit
    };
}