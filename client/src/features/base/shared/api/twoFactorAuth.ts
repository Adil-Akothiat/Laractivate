import { api } from "@/app/services/api";
import type { ApiResponseSchema } from "@/app/types";

const BASE_ROUTE = "/user/accounts";

export const twoFactorApi = {
  init: () =>
    api.post<ApiResponseSchema<null>>(`${BASE_ROUTE}/two-factor/init`),

  enable: (data: { otp: string }) =>
    api.post<ApiResponseSchema<null>>(`${BASE_ROUTE}/two-factor/enable`, data),

  verify: (data: { code: string; token: string }) =>
    api.post<ApiResponseSchema<null>>(
      `/auth/two-factor/verify`,
      { code: data.code },
      {
        headers: {
          Authorization: "Bearer " + data.token,
        },
      },
    ),

  disable: (data: { password: string }) =>
    api.put<ApiResponseSchema<null>>(`${BASE_ROUTE}/two-factor/disable`, {
      password: data.password,
    }),

  regenerateRecoveryCodes: () =>
    api.post<ApiResponseSchema<null>>(
      `${BASE_ROUTE}/two-factor/regenerate-codes`,
    ),
};