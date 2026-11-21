import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import type {
    ApiResponseSchema
} from "@/app/types";
import { UserSchema } from "@/entities";
import { userKeys } from "@/entities/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfilePayload } from "..";

const updateProfileDetails = (data: UpdateProfilePayload) =>
    api.put<ApiResponseSchema<UserSchema>>(API_ROUTES.user.profile.base, data)
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
    api.put<ApiResponseSchema<null>>(
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