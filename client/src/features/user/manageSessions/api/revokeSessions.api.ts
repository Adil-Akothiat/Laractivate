import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ResourceSchema } from "@/app/types";
import { sessionKeys } from "@/entities/session/api/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const revokeAllSessions = () =>
    api.put<ResourceSchema<null>>(API_ROUTES.user.security.sessions)


export const useRevokeAllSessions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: revokeAllSessions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.list() });
        }
    })
}
