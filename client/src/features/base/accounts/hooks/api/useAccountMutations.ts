import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../../api";
import { accountKeys } from "./keys";
import { useToastContext } from "@/app/hooks/common";

export const useAccountMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToastContext();

  // --- Core CRUD ---

  const create = useMutation({
    mutationFn: accountApi.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success(response.data.message || "Account created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create account");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountApi.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success(response.data.message || "Account updated");
    },
    onError: (err:any) => {
      toast.error(err?.response?.data?.message||'UpdateFailed')
    },
  });

  const remove = useMutation({
    mutationFn: accountApi.remove,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success(response.data.message || "Account deleted");
    },
    onError: () => toast.error("Could not delete account"),
  });

  // --- Security & Profile ---

  const updateAvatar = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      accountApi.profile.updateAvatar(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
      toast.success(response.data.message || "Avatar updated");
    },
    onError: () => toast.error("Failed to update avatar"),
  });

  const changePassword = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountApi.profile.changePassword(id, data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    },
  });

  const disableTwoFactor = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { password: string } }) =>
      accountApi.profile.disableTwoFactor(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
      toast.success(
        response.data.message || "Two-factor authentication disabled",
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to disable two-factor authentication",
      );
    },
  });

  // --- Sessions ---

  const revokeSession = useMutation({
    mutationFn: ({ id, sessionId }: { id: string; sessionId: number }) =>
      accountApi.sessions.revoke(id, sessionId),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.sessions(id) });
      toast.success(response.data.message || "Session revoked");
    },
    onError: () => toast.error("Failed to revoke session"),
  });

  const revokeAllSessions = useMutation({
    mutationFn: (id: string) => accountApi.sessions.revokeAll(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.sessions(id) });
      toast.success(response.data.message || "All sessions revoked");
    },
    onError: () => toast.error("Failed to revoke all sessions"),
  });

  const clearSessionHistory = useMutation({
    mutationFn: (id: string) => accountApi.sessions.clearHistory(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.sessions(id) });
      toast.success(response.data.message || "Session history cleared");
    },
    onError: () => toast.error("Failed to clear session history"),
  });

  const assignRole = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      accountApi.rbac.assignRole(userId, roleId),
    onSuccess: (response, { userId }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(userId) });
      toast.success(response.data.message || "Role assigned");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unassign role");
    },
  });

  const unAssignRole = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      accountApi.rbac.unAssignRole(userId, roleId),
    onSuccess: (response, { userId }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(userId) });
      toast.success(response.data.message || "Role unassigned");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unassign role");
    },
  });

  return {
    // Core CRUD
    create,
    update,
    remove,
    // Security & Profile
    updateAvatar,
    changePassword,
    disableTwoFactor,
    // Sessions
    revokeSession,
    revokeAllSessions,
    clearSessionHistory,
    // rbac
    unAssignRole,
    assignRole
  };
};
