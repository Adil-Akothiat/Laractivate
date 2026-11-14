import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";

const forgotPassword = (email: string) =>
    api.post<ApiResponseSchema<null>>(API_ROUTES.auth.forgotPassword, { email })


export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    })
}