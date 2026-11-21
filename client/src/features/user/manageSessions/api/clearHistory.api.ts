
import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { sessionKeys } from "@/entities/session/api/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const clearHistory = () =>
    api.delete<ApiResponseSchema<null>>(
        API_ROUTES.user.security.clearHistory
    )


export const useClearHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearHistory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.list() })
        }
    })
}