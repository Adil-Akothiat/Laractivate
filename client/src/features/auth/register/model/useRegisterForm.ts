import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api";
import { RegisterPayload } from "./";

export function useRegisterForm() {
    const navigate = useNavigate();
    const registerMutation = useRegisterMutation();
    const { mutate } = registerMutation;
    const [form, setForm] = useState<RegisterPayload>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const setValue = (key: string, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation,
            },
            {
                onSuccess: (res) => {
                    navigate(res.data.data.redirect_path);
                },
            },
        );
    };

    return {
        registerMutation,
        form,
        setForm,
        setValue,
        handleSubmit
    }
}