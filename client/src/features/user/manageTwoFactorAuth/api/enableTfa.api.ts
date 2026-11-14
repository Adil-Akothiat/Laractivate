import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { userKeys } from "@/entities/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const enable = (data: { otp: string }) =>
    api.post<ApiResponseSchema<{ recoveryCodes: string[] }>>(
        API_ROUTES.user.security.twoFactor.enable,
        data,
    )
export const useEnableTfa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.user });
        }
    });
}