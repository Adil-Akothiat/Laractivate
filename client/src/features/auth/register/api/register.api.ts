import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { LoginSuccessResponseSchema } from "../../login";
import { RegisterPayload } from "../model";


const register = (data: RegisterPayload) =>
    api.post<ApiResponseSchema<LoginSuccessResponseSchema>>(API_ROUTES.auth.register, data)

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) =>
            register(data),
    });
}