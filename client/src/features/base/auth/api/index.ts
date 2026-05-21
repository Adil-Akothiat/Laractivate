import { api } from "@/app/services/api";
import type { ApiResponseSchema } from "@/app/types";
import type { RegisterPayloadType } from "../types";

const BASE_ROUTE = "/auth";

export const authApi = {
  // --- Core Authentication ---
  login: (email: string, password: string) =>
    api.post(`${BASE_ROUTE}/login`, { email, password }),

  register: (data: RegisterPayloadType) =>
    api.post(`${BASE_ROUTE}/register`, data),

  logout: () =>
    api.post(`${BASE_ROUTE}/logout`),

  // --- Password Management ---
  password: {
    forgot: (email: string) =>
      api.post(`${BASE_ROUTE}/forgot-password`, { email }),

    reset: (data: {
      email: string;
      token: string;
      password: string;
      password_confirmation: string;
    }) => 
      api.post(`${BASE_ROUTE}/reset-password`, data),
  },

  // --- Multi-Factor Authentication ---
  twoFactor: {
    verify: (data: { code: string; token: string }) =>
      api.post<ApiResponseSchema<null>>(
        `${BASE_ROUTE}/two-factor/verify`,
        { code: data.code },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      ),
  },
};