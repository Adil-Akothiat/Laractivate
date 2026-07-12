import { api } from '@/app/services/api';
import type { PaginatedResponseSchema, ResourceSchema } from '@/app/types';
import type { FilterRolesParams, StoreRolePayload, UpdateRolePayload } from '../types';
import type { RoleSchema, PermissionResponseSchema } from '../../shared';

const BASE_ROUTE = '/access/rbac';

export const rbacApi = {
  // --- Roles ---
  roles: {
    list: (params: FilterRolesParams) =>
      api.get<PaginatedResponseSchema<RoleSchema>>(`${BASE_ROUTE}/roles`, { params }),

    get: (id: string) =>
      api.get<ResourceSchema<RoleSchema>>(`${BASE_ROUTE}/roles/${id}`),

    create: (data: StoreRolePayload) =>
      api.post<ResourceSchema<RoleSchema>>(`${BASE_ROUTE}/roles`, data),

    update: (id: string, data: UpdateRolePayload) =>
      api.put<ResourceSchema<RoleSchema>>(`${BASE_ROUTE}/roles/${id}`, data),

    remove: (id: string) =>
      api.delete<ResourceSchema<null>>(`${BASE_ROUTE}/roles/${id}`),
  },

  // --- Permissions ---
  permissions: {
    list: () =>
      api.get<ResourceSchema<PermissionResponseSchema>>(`${BASE_ROUTE}/permissions`),
  },
};
