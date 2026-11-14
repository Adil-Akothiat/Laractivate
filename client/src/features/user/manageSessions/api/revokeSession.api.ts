import { API_ROUTES } from "@/app/config/routes";
import { api } from "@/app/services/api";
import { ResourceSchema } from "@/app/types";
import { sessionKeys } from "@/entities/session/api/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const revokeSession = (id: number) =>
    api.put<ResourceSchema<null>>(API_ROUTES.user.security.sessionById(id))

export const useRevokeSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => revokeSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.list() });
        }
    });
}
