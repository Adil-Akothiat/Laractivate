import { useQuery } from "@tanstack/react-query";
import { accountApi } from "../../api";
import { accountKeys } from "./keys";
import type { FilterAccountsParams } from "../../types";

export const useAccounts = (params: FilterAccountsParams) => {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountApi.list(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useAccount = (id: string | undefined) => {
  return useQuery({
    queryKey: accountKeys.detail(id!),
    queryFn: () => accountApi.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAccountSessions = (id: string | undefined) => {
  return useQuery({
    queryKey: accountKeys.sessions(id!),
    queryFn: () => accountApi.sessions.list(id!),
    enabled: !!id,
  });
};

export const useAccountLogs = (id: string | undefined, page: number) => {
  return useQuery({
    queryKey: accountKeys.logs(id!, page),
    queryFn: () => accountApi.logs.list(id!, page),
    enabled: !!id,
    placeholderData: (previousData) => previousData, // smooth pagination
  });
};