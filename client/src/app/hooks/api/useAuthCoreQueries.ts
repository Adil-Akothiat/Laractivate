import { useQuery } from "@tanstack/react-query";
import { authCoreApi } from "../../api/authCoreApi"; // Adjust to point to your authCoreApi path
import { authCoreKeys } from "./keys";

export const useMe = () =>
  useQuery({
    queryKey: authCoreKeys.session(),
    queryFn: () => authCoreApi.getMe(),
    retry: false,
    select: (res)=> res.data
  });

export const useValidateResetToken = (email: string | null, token: string | null) =>
  useQuery({
    queryKey: authCoreKeys.resetToken(email, token),
    queryFn: () => authCoreApi.checkResetToken(email, token),
    enabled: !!email && !!token, // Only run if both parameters exist
    retry: false,               // Do not retry on a terminal validation failure
    staleTime: 0,               // Always run validation fresh
    refetchOnWindowFocus: false,
    select: res=> res.data 
  });