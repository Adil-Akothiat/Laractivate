import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearHistory, getUserSessions, revokeAllSessions, revokeSession } from "../api";

export const useUserSessions = ()=> useQuery({
    queryKey: ["settings", "sessions"],
    queryFn: async () => {
      const { data } = await getUserSessions();
      return data;
    },
    retry: false,
});

export const useRevokeUserSessions = ()=> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id:number) => revokeSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "sessions"] });
        },
    });
}

// revoke all other sessions except current session(auth)
export const useRevokeAllSessions = ()=> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (_:unknown) => revokeAllSessions(),
        onSuccess: ()=> {
            queryClient.invalidateQueries({ queryKey: ["settings", "sessions"] });
        }
    });
}

export const useClearHistory = ()=> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (_:unknown) => clearHistory(),
        onSuccess: ()=> {
            queryClient.invalidateQueries({ queryKey: ["settings", "sessions"] });
        }
    });
}