import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ApiResponseSchema } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import { RoleSchema } from "../model";
import { roleKeys } from "./keys";

const getWorkspaceRole = (id: string) =>
    api.get<ApiResponseSchema<RoleSchema>>(API_ROUTES.workspace.roles.getRole(id))

export const useGetWorkspaceRole = (id: string) => useQuery({
    queryKey: roleKeys.workspace.getRole(id),
    queryFn: () => getWorkspaceRole(id)
})