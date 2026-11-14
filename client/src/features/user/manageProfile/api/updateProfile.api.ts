import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import type {
    ResourceSchema
} from "@/app/types";
import { userKeys } from "@/entities/user";
import { UserSchema } from "@/features/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfilePayload } from "..";

const updateProfileDetails = (data: UpdateProfilePayload) =>
    api.put<ResourceSchema<UserSchema>>(API_ROUTES.user.profile.base, data)
export const useUpdateProfileDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfileDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.user })
        }
    });
}

const updateAvatar = (data: FormData) =>
    api.put<ResourceSchema<null>>(
        API_ROUTES.user.profile.updateAvatar,
        data,
        {
            headers: { "Content-Type": "multipart/form-data" },
        },
    );
export const useUpdateUserAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAvatar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.user })
        }
    });
} 