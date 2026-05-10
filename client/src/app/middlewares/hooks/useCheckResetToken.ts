import { useQuery } from "@tanstack/react-query";
import { checkResetToken } from "../api";

/**
 * Hook to validate the reset token status.
 * We use 'enabled' to ensure it only runs when both params exist.
*/
export const useValidateResetToken = (email:string|null, token:string|null) => {
  return useQuery({
    queryKey: ["reset-password","validate-reset-token", email, token],
    queryFn: () => checkResetToken(email, token),
    enabled: !!email && !!token, // Only run if email and token are present
    retry: false,               // Don't retry on failure (if it's 403, it's 403)
    staleTime: 0,               // Always check fresh
    refetchOnWindowFocus: false, 
  });
};