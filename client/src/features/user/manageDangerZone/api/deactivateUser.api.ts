import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ResourceSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";

const deactivateUser = (data: { password: string }) =>
    api.post<ResourceSchema<null>>(API_ROUTES.user.security.deactivateUser, data)

export const useDeactivateUser = () => {
    return useMutation({
        mutationFn: deactivateUser
    })
};
