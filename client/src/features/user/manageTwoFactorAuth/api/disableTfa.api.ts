import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { userKeys } from "@/entities/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const disable = (data: { password: string }) =>
    api.patch<ApiResponseSchema<null>>(API_ROUTES.user.security.twoFactor.disable, {
        password: data.password,
    })
export const useDisableTfa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: disable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.user })
        }
    });
}

