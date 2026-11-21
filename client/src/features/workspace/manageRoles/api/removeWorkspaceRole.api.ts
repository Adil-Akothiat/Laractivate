import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema, PaginatedResponseSchema } from "@/app/types";
import { roleKeys, RoleSchema } from "@/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeRole = (id: string) =>
    api.delete<ApiResponseSchema<null>>(API_ROUTES.workspace.roles.removeRole(id))

export const useRemoveWorkspaceRole = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => removeRole(id),
        onSuccess: () => {
            queryClient.setQueriesData<PaginatedResponseSchema<RoleSchema>>(
                {
                    queryKey: roleKeys.workspace.all
                },
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter(role => role.id !== id)
                    }
                }
            );
        }
    });
}