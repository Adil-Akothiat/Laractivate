export const authCoreKeys = {
  all: ["auth-core"] as const,
  session: () => [...authCoreKeys.all, "session"] as const,
  resetToken: (email: string | null, token: string | null) => 
    [...authCoreKeys.all, "validate-reset-token", email, token] as const,
};