import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientKeys } from "./keys";
import { workspaceApi } from "../../api";

export const useWorkspacesMutations = {
    switch: () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (clientId: number) => {
                const { data } = await workspaceApi.switchWorkspace(clientId);
                return data.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: clientKeys.workspaces })
            }
        });
    },
    create: ()=> {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (name: string) => {
                const { data } = await workspaceApi.create(name);
                return data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: clientKeys.workspaces })
            }
        });
    }
}