import { useEffect, useState } from "react";
import { useUpdateProfileDetails, useUpdateUserAvatar } from "../api";
import { UpdateProfilePayload } from "./profile.types";
import { UserSchema } from "@/entities";

export const useUpdateUserProfile = (user: UserSchema) => {
    const [form, setForm] = useState<UpdateProfilePayload>({
        first_name: user.first_name,
        last_name: user.last_name
    });
    const updateProfile = useUpdateProfileDetails();
    const uploadAvatar = useUpdateUserAvatar();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate(
            { first_name: form.first_name, last_name: form.last_name }
        );
    };

    useEffect(() => {
        if (user?.first_name) setForm(prev => ({ ...prev, firstName: user.first_name }));
        if (user?.last_name) setForm(prev => ({ ...prev, lastName: user.last_name }));
    }, [user]);


    return {
        form,
        setForm,
        updateProfile,
        handleSubmit,
        uploadAvatar
    }
}