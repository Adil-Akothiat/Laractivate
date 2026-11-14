import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { LoginPayload, LoginResponseSchema } from "../model";

const login = (email: string, password: string) =>
    api.post<ApiResponseSchema<LoginResponseSchema>>(API_ROUTES.auth.login, { email, password })

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: ({ email, password }: LoginPayload) =>
            login(email, password)
    });
}