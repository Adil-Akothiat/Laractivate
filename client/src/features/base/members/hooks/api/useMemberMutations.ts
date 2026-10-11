import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberApi } from "../../api";
import { InviteMemberPayload } from "../../types";
import { memberKeys } from "./keys";

export const useMemberMutations = {
    invite: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (payload: InviteMemberPayload) => memberApi.invite(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: memberKeys.members });
            }
        })
    }
}