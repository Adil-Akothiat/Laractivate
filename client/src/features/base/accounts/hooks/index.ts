import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    changeAccountPassword,
    clearAccountSessionHistory,
    createAccount,
    deleteAccount,
    disableAccountTwoFactor,
    getAccount,
    getAccountActivityLogs,
    getAccounts,
    revokeAccountSession,
    revokeAllAccountSession,
    updateAccount,
    updateAccountAvatar,
} from "../api";
import type {
    CreateUserPayload,
    FilterAccountsParams,
    UpdateUserPayload,
} from "../types";
import { useSearchParams } from "react-router-dom";

export const useAccounts = {
    getAccounts: ({ page = 1, search, role, status }: FilterAccountsParams) =>
        useQuery({
            queryKey: ["accounts", page, search, role, status],
            queryFn: () =>
                getAccounts({ page, search, role, status }).then(
                    (res) => res.data,
                ),
        }),
    getAccount: (id: string) =>
        useQuery({
            queryKey: ["accounts", id],
            queryFn: () => getAccount(id).then((res) => res.data),
        }),
    create: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (data: CreateUserPayload) => createAccount(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            },
        });
    },
    update: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({
                id,
                data,
            }: {
                id: string;
                data: UpdateUserPayload;
            }) => updateAccount(id, data),
            onMutate: async ({ id, data }) => {
                await queryClient.cancelQueries({ queryKey: ["accounts"] });
                // Snapshot the previous value
                const previousAccounts = queryClient.getQueryData(["accounts"]);

                // Optimistically update the detailed user cache
                queryClient.setQueryData(["accounts", id], (old: any) => ({
                    ...old,
                    ...data,
                }));

                // Return context object with snapshotted value
                return { previousAccounts };
            },
            // Step 2: If the mutation fails, use the context we returned above
            onError: (err, variables, context) => {
                queryClient.setQueryData(
                    ["accounts"],
                    context?.previousAccounts,
                );
            },
            // Step 3: Always refetch after error or success to sync with server
            onSettled: (data, error, variables) => {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
                queryClient.invalidateQueries({
                    queryKey: ["accounts", variables.id],
                });
            },
        });
    },
    updateAvatar: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }: { id: string; data: FormData }) =>
                updateAccountAvatar(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["accounts", "profile", "change-avatar"],
                });
            },
        });
    },
    changePassword: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({
                id,
                data,
            }: {
                id: string;
                data: {
                    current_password: string;
                    password: string;
                    password_confirmation: string;
                };
            }) => changeAccountPassword(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["accounts", "security", "password"],
                });
            },
        });
    },
    disableTwoFactor: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({
                id,
                data,
            }: {
                id: string;
                data: { password: string };
            }) => disableAccountTwoFactor(id, data),
            onMutate: async ({ id }) => {
                await queryClient.cancelQueries({ queryKey: ["accounts", id] });
                const previousUser = queryClient.getQueryData(["accounts", id]);

                // Instantly set 2FA to false in the UI
                queryClient.setQueryData(["accounts", id], (old: any) => ({
                    ...old,
                    two_factor_enabled: false,
                }));

                return { previousUser };
            },
            onError: (err, variables, context) => {
                queryClient.setQueryData(
                    ["accounts", variables.id],
                    context?.previousUser,
                );
            },
            onSettled: (data, error, variables) => {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
                queryClient.invalidateQueries({
                    queryKey: ["accounts", variables.id],
                });
            },
        });
    },
    delete: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => deleteAccount(id),
            onMutate: async (id) => {
                await queryClient.cancelQueries({ queryKey: ["accounts"] });
                const previousAccounts = queryClient.getQueryData(["accounts"]);

                // Optimistically remove the user from the list
                queryClient.setQueryData(["accounts"], (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        // Filter out the deleted user from the items array
                        roles: old.roles?.filter((user: any) => user.id !== id),
                    };
                });

                return { previousAccounts };
            },
            onError: (err, id, context) => {
                queryClient.setQueryData(
                    ["accounts"],
                    context?.previousAccounts,
                );
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            },
        });
    },
    revokeSession: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({
                accountId,
                sessionId,
            }: {
                accountId: string;
                sessionId: number;
            }) => revokeAccountSession(accountId, sessionId),
            onSettled: (_, __, { accountId }) => {
                queryClient.invalidateQueries({
                    queryKey: ["accounts", accountId],
                });
            },
        });
    },

    revokeAllSessions: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => revokeAllAccountSession(id),
            onSettled: (_, __, id) => {
                queryClient.invalidateQueries({ queryKey: ["accounts", id] });
            },
        });
    },

    clearSessionHistory: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => clearAccountSessionHistory(id),
            onSettled: (_, __, id) => {
                queryClient.invalidateQueries({ queryKey: ["accounts", id] });
            },
        });
    },

    getActivityLogs: (page:number, userId:string)=>  useQuery({
            queryKey: ["activity-logs", page],
            queryFn: () =>
                getAccountActivityLogs(page, userId)
        })
};

export const useAccountsFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const setFilters = (
        filters: Partial<{
            page: number;
            search: string;
            role: string;
            status: string;
        }>,
    ) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(filters).forEach(([key, value]) => {
                if (value) next.set(key, String(value));
                else next.delete(key);
            });

            // reset page when filters change
            if (Object.keys(filters).some((k) => k !== "page")) {
                next.set("page", "1");
            }

            return next;
        });
    };

    return { page, search, role, status, setFilters };
};