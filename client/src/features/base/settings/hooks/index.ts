import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getProfile,
    updateProfile,
    changePassword,
    deactivateAccount,
    deleteAccount,
    updateAvatar,
    getProfileActivityLogs,
} from "../api";
import type {
    UpdateProfilePayload,
    ChangePasswordPayload,
    AccountActionPayload,
} from "../types";

export const useProfile = () =>
    useQuery({
        queryKey: ["user", "profile"],
        queryFn: () => getProfile().then((res) => res.data),
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfilePayload) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        },
    });
};

export function useUpdateAvatarProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => updateAvatar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", "profile", "change-avatar"] });
        },
    });
}   

export const useChangePassword = () =>
    useMutation({
        mutationFn: (data: ChangePasswordPayload) => changePassword(data),
    });

export const useDeactivateAccount = () =>
    useMutation({
        mutationFn: (data: AccountActionPayload) => deactivateAccount(data),
    });

export const useDeleteAccount = () =>
    useMutation({
        mutationFn: (data: AccountActionPayload) => deleteAccount(data),
});

export const useProfileActivityLogs = (page=1)=> useQuery({
    queryKey: ["settings", "activity-logs", page],
    queryFn: async () => {
      const { data } = await getProfileActivityLogs(page);
      return data;
    },
    retry: false,
});