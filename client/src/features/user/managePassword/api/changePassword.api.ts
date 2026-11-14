import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ResourceSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordPayload } from "../model/managePassword.types";

const changePassword = (data: ChangePasswordPayload) =>
    api.post<ResourceSchema<null>>(API_ROUTES.user.security.changePassword, data);

export const useChangePassword = () => useMutation({
    mutationFn: changePassword
});