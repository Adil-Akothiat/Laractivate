import { api } from '@/app/services/api';
import type { ApiResponseSchema, PaginatedResponseSchema, ResourceSchema } from '@/app/types';
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  AccountActionPayload,
} from '../types';
import type { LogSchema, SessionResponseSchema, UserSchema } from '../../shared';

const BASE_ROUTE = '/user';
export const settingsApi = {
  // --- Profile ---
  profile: {
    get: () =>
      api.get<ResourceSchema<UserSchema>>(`${BASE_ROUTE}/profile`),

    update: (data: UpdateProfilePayload) =>
      api.put<ResourceSchema<UserSchema>>(`${BASE_ROUTE}/profile`, data),

    updateAvatar: (data: FormData) =>
      api.put<ResourceSchema<null>>(`${BASE_ROUTE}/profile/update-avatar`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    delete: (data: AccountActionPayload) =>
      api.delete<ResourceSchema<null>>(`${BASE_ROUTE}/profile`, { data }),
  },

  // --- Security ---
  security: {
    changePassword: (data: ChangePasswordPayload) =>
      api.post<ResourceSchema<null>>(`${BASE_ROUTE}/security/password`, data),

    deactivateAccount: (data: AccountActionPayload) =>
      api.post<ResourceSchema<null>>(`${BASE_ROUTE}/security/deactivate`, data),
  },

  // --- Sessions ---
  sessions: {
    list: () =>
      api.get<ApiResponseSchema<SessionResponseSchema>>(`${BASE_ROUTE}/profile/sessions`),
    revoke: (id: number) =>
      api.put<ResourceSchema<null>>(`${BASE_ROUTE}/profile/sessions/${id}`),

    revokeAll: () =>
      api.put<ResourceSchema<null>>(`${BASE_ROUTE}/profile/sessions`),

    clearHistory: () =>
      api.delete<ResourceSchema<null>>(`${BASE_ROUTE}/profile/sessions/clear-history`),
  },

  // --- Logs ---
  activityLogs: {
    list: (page: number) =>
      api.get<PaginatedResponseSchema<LogSchema>>(`${BASE_ROUTE}/profile/activity-logs?page=${page}`),
  },
};
