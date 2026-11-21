import { FilterRolesParams } from "../model";

export const roleKeys = {
    workspace: {
        all: ["workspace-roles"] as const,
        list: (params: FilterRolesParams) => [...roleKeys.workspace.all, { params }] as const,
        // getRole: (id: string) => [...roleKeys.workspace.all, id],
        getPermissions: ['workspace-permissions'] as const
    },
};