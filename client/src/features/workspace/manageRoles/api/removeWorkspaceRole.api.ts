import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { roleKeys } from "@/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeRole = async (id: string) =>{
    const response = await api.delete<ApiResponseSchema<null>>(API_ROUTES.workspace.roles.removeRole(id));
    return response.data;
}

export const useRemoveWorkspaceRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => removeRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roleKeys.workspace.all });
        }
    });
}