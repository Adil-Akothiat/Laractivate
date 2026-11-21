import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { PaginatedResponseSchema } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { FilterRolesParams, RoleSchema } from "../model";
import { roleKeys } from "./keys";

const getWorkspaceRoles = (params: FilterRolesParams) => api.get<PaginatedResponseSchema<RoleSchema>>(API_ROUTES.workspace.roles.getRoles, { params })

export const useGetWorkspaceRoles = (params: FilterRolesParams) => useQuery({
    queryKey: roleKeys.workspace.list(params),
    queryFn: () => getWorkspaceRoles(params),
    select: (res) => res.data
});