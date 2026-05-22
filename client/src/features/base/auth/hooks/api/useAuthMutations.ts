import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api"; // Points to your newly updated authApi
import type {
  LoginPayloadType,
  RegisterPayloadType,
  ResetPasswordPayloadType,
} from "../../types";
// import { useToastContext } from "@/app/hooks/common";

export function useAuthMutations() {
    // const { toast } = useToastContext();
  return {
    // --- Core Authentication ---
    login: useMutation({
      mutationFn: ({ email, password }: LoginPayloadType) =>
        authApi.login(email, password),
    }),

    register: useMutation({
      mutationFn: (data: RegisterPayloadType) => 
        authApi.register(data),
    }),

    logout: useMutation({
      mutationFn: () => authApi.logout(),
    }),

    // --- Password Management ---
    password: {
      forgot: useMutation({
        mutationFn: (email: string) => authApi.password.forgot(email),
      }),
      
      reset: useMutation({
        mutationFn: (data: ResetPasswordPayloadType) =>
          authApi.password.reset(data),
      }),
    },

    // --- Multi-Factor Authentication ---
    twoFactor: {
      verify: useMutation({
        mutationFn: (data: { code: string; token: string }) => 
          authApi.twoFactor.verify(data),
      }),
    },
  };
}