import { api } from '@/app/services/api';
import type { ApiResponseSchema, PaginatedResponseSchema, ResourceSchema } from '@/app/types';
import type { 
  FilterAccountsParams,
  UserCreatePayload,
  UserUpdatePayload,
} from '../types';
import type { LogSchema, SessionResponseSchema, UserSchema } from '../../shared';

const BASE_ROUTE = '/user/accounts';

export const accountApi = {
  // --- Core CRUD ---
  list: (params: FilterAccountsParams) =>
    api.get<PaginatedResponseSchema<UserSchema>>(BASE_ROUTE, { params }),

  get: (id: string) =>
    api.get<ResourceSchema<UserSchema>>(`${BASE_ROUTE}/${id}`),

  create: (data: UserCreatePayload) =>
    api.post<ResourceSchema<UserSchema>>(BASE_ROUTE, data),

  update: (id: string, data: UserUpdatePayload) =>
    api.put<ResourceSchema<UserSchema>>(`${BASE_ROUTE}/${id}`, data),

  remove: (id: string) =>
    api.delete<ResourceSchema<null>>(`${BASE_ROUTE}/${id}`),

  // --- Security & Profile ---
  profile: {
    updateAvatar: (id: string, data: FormData) =>
      api.post(`${BASE_ROUTE}/${id}/update-avatar`, data),
    changePassword: (id: string, data: any) =>
      api.put(`${BASE_ROUTE}/${id}/security/password`, data),
    disableTwoFactor: (id: string, data: { password: string }) =>
      api.delete<ApiResponseSchema<null>>(`${BASE_ROUTE}/${id}/security/two-factor`, { data })
  },

  // --- Sessions ---
  sessions: {
    list: (id: string) => 
      api.get<ApiResponseSchema<SessionResponseSchema>>(`${BASE_ROUTE}/${id}/sessions`),

    revoke: (id: string, sessionId: number) =>
      api.put(`${BASE_ROUTE}/${id}/sessions/${sessionId}`),

    revokeAll: (id: string) =>
      api.put(`${BASE_ROUTE}/${id}/sessions`),

    clearHistory: (id: string) =>
      api.delete(`${BASE_ROUTE}/${id}/sessions/clear-history`),
  },

  // --- Logs ---
  logs: {
    list: (id: string, page: number) =>
      api.get<PaginatedResponseSchema<LogSchema>>(`${BASE_ROUTE}/${id}/activity-logs`, {
        params: { page },
      }),
  },

  // --- Rbac ---
  rbac: {
    assignRole: (userId:string, roleId:string)=> api.post<ApiResponseSchema<null>>(`${BASE_ROUTE}/${userId}/${roleId}/assign`),
    unAssignRole: (userId:string, roleId:string)=> api.delete<ApiResponseSchema<null>>(`${BASE_ROUTE}/${userId}/${roleId}/unassign`),
  }
};