import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { LoginSuccessResponseSchema, TfaLoginVerificationPayload } from "../model";

const verify = ({ code, token }: TfaLoginVerificationPayload) =>
    api.post<ApiResponseSchema<LoginSuccessResponseSchema>>(
        API_ROUTES.auth.verifyTfa,
        { code },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

export const useLoginTfaVerifyMutation = () => {
    return useMutation({
        mutationFn: (data: TfaLoginVerificationPayload) =>
            verify(data)
    });
}