import { API_ROUTES } from "@/app/config/routes"
import { api } from "@/app/services/api"
import { ApiResponseSchema } from "@/app/types"
import { roleKeys } from "@/entities"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateRolePayload } from "../model"

const updateRole = async (data: UpdateRolePayload) => {
    const res = await api.put<ApiResponseSchema<null>>(API_ROUTES.workspace.roles.updateRole(data.id), data)
    return res.data;
}

export const useUpdateWorkspaceRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateRolePayload) => updateRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: roleKeys.workspace.all })
        }
    })
}