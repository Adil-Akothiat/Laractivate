import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { userKeys } from "@/entities/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const regenerateRecoveryCodes = () =>
    api.post<ApiResponseSchema<{ recoveryCodes: string[] }>>(
        API_ROUTES.user.security.twoFactor.regenerateRecoveryCodes
    )

export const useRegenerateRecoveryCodes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: regenerateRecoveryCodes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.user });
        }
    });
}
