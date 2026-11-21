import { API_ROUTES } from "@/app/config/routes"
import { api } from "@/app/services/api"
import { ApiResponseSchema, PaginatedResponseSchema } from "@/app/types"
import { roleKeys, RoleSchema } from "@/entities"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateRolePayload } from "../model"

const updateRole = (id: string, data: UpdateRolePayload) =>
    api.put<ApiResponseSchema<RoleSchema>>(API_ROUTES.workspace.roles.updateRole(id), data)

export const useUpdateWorkspaceRole = (id: string, data: UpdateRolePayload) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateRole(id, data),
        onSuccess: (res) => {
            queryClient.setQueriesData<PaginatedResponseSchema<RoleSchema>>(
                {
                    queryKey: roleKeys.workspace.all
                },
                (oldData) => {
                    if (!oldData || !oldData?.meta) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map(role => role.id === res.data.data.id ? res.data.data : role)
                    };
                }
            );
        }
    })
}