import { api } from '@/app/services/api';
import type { ApiResponseSchema, ResourceSchema } from '@/app/types';
import type { UserSchema } from '@/features/base/shared'; // Adjust path if your shared types live elsewhere

const BASE_ROUTE = '/auth';

export const authCoreApi = {
  /**
   * Fetches the currently authenticated user profile session.
   * Consumed globally by layout shells, sidebars, and route guards.
   */
  getMe: () =>
    api.get<ResourceSchema<UserSchema>>(`${BASE_ROUTE}/me`).then((res) => res.data),

  /**
   * Validates a password reset token from URL parameters.
   * Consumed globally or at the route-guard level to protect reset routes.
   */
  checkResetToken: (email: string | null, token: string | null) =>
    api.get<ApiResponseSchema<null>>(`${BASE_ROUTE}/reset-password/validate-token`, {
      params: { email, token },
    }),
};