import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordPayload } from "../model/resetPassword.types";

const reset = (data: ResetPasswordPayload) =>
    api.post<ApiResponseSchema<null>>(API_ROUTES.auth.resetPassword, data)

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationFn: (data: ResetPasswordPayload) =>
            reset(data),
    })
}
