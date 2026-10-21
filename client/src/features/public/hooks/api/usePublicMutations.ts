import { useMutation } from "@tanstack/react-query";
import { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../../types";
import { authApi } from "../../api/auth";

export const useAuthMutations = {
    // --- Core Authentication ---
    login: ()=> useMutation({
      mutationFn: ({ email, password }: LoginPayload) =>
        authApi.login(email, password),
    }),

    register: ()=> useMutation({
      mutationFn: (data: RegisterPayload) => 
        authApi.register(data),
    }),

    logout: ()=> useMutation({
      mutationFn: () => authApi.logout(),
    }),

    // --- Password Management ---
    password: {
      forgot: ()=> useMutation({
        mutationFn: (email: string) => authApi.password.forgot(email),
      }),
      
      reset: ()=> useMutation({
        mutationFn: (data: ResetPasswordPayload) =>
          authApi.password.reset(data),
      }),
    },

    // --- Multi-Factor Authentication ---
    twoFactor: {
      verify: ()=> useMutation({
        mutationFn: (data: { code: string; token: string }) => 
          authApi.twoFactor.verify(data),
      }),
    },
}