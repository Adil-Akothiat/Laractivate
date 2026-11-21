import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordPayload } from "../model/managePassword.types";

const changePassword = (data: ChangePasswordPayload) =>
    api.patch<ApiResponseSchema<null>>(API_ROUTES.user.security.changePassword, data);

export const useChangePassword = () => useMutation({
    mutationFn: changePassword
});