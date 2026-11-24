import { API_ROUTES } from "@/app/config/routes"
import { api } from "@/app/services/api"
import { ApiResponseSchema } from "@/app/types"
import { roleKeys } from "@/entities"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { StoreRolePayload } from "../model"

const createRole = async (data: StoreRolePayload) => {
  const res = await api.post<ApiResponseSchema<null>>(API_ROUTES.workspace.roles.createRole, data)
  return res.data;
}

export const useCreateWorkspaceRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreRolePayload) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.workspace.all });
    }
  })
}
