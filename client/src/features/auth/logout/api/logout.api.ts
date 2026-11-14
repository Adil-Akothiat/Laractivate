import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";

const logout = () =>
    api.post<ApiResponseSchema<null>>(API_ROUTES.auth.logout)

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: logout,
    });
}
