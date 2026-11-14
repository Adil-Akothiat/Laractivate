import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";

const init = () =>
    api.post<ApiResponseSchema<{ tfaQrcode: string }>>(API_ROUTES.user.security.twoFactor.init)



export const useInitTfa = () => {
    return useMutation({
        mutationFn: init
    });
}
