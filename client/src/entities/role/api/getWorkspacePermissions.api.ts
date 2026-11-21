import { API_ROUTES } from "@/app/config/routes"
import { api } from "@/app/services/api"
import { ApiResponseSchema } from "@/app/types"
import { useQuery } from "@tanstack/react-query"
import { PermissionResponseSchema } from "../model"
import { roleKeys } from "./keys"

const getPermissions = () =>
    api.get<ApiResponseSchema<PermissionResponseSchema>>(API_ROUTES.workspace.permissions.getPermissions)

export const useGetWorkspacePermissions = () => useQuery({
    queryKey: roleKeys.workspace.getPermissions,
    queryFn: getPermissions,
    select: (res) => {
        return {
            ...res.data.data,
            permissionIds: res.data.data.permissions.map(perm => perm.id)
        }
    }
})