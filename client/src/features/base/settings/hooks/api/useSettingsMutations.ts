import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../api';
import { settingsKeys } from './keys';
import { useToastContext } from '@/app/hooks/common';
import { getErrorsMessagesStr } from '@/app/utils';

export const useSettingsMutations = () => {
  const queryClient = useQueryClient();
  const { toast }   = useToastContext();

  // --- Profile ---

  const updateProfile = useMutation({
    mutationFn: settingsApi.profile.update,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success(response.data.message || 'Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    },
  });

  const updateAvatar = useMutation({
    mutationFn: settingsApi.profile.updateAvatar,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      toast.success(response.data.message || 'Avatar updated');
    },
    onError: () => toast.error('Failed to update avatar'),
  });

  const deleteAccount = useMutation({
    mutationFn: settingsApi.profile.delete,
    onSuccess: (res)=>{
      toast.success(res.data.message || 'Account deleted successfully.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    },
  });

  // --- Security ---

  const changePassword = useMutation({
    mutationFn: settingsApi.security.changePassword,
    onSuccess: (res)=> {
      toast.success(res.data.message || 'Password changed successfully.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    },
  });

  const deactivateAccount = useMutation({
    mutationFn: settingsApi.security.deactivateAccount,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate account');
    },
  });

  // 2fa
  const tfa = {
    init: useMutation({
      mutationFn: settingsApi.security.tfa.init,
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
        toast.success(response.data.message || 'Init successfully.');
      },
      onError: (err) => toast.error(getErrorsMessagesStr(err))
    }),
    enable: useMutation({
      mutationFn: settingsApi.security.tfa.enable,
      onSuccess: (response)=> {
        queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
        toast.success(response.data.message || 'Enabled successfully.');
      },
      onError: (err)=> toast.error(getErrorsMessagesStr(err))
    }),
    disable: useMutation({
      mutationFn: settingsApi.security.tfa.disable,
      onSuccess: (response)=> {
        queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
        toast.success(response.data.message || 'Disabled successfully.');
      },
      onError: (err)=> toast.error(getErrorsMessagesStr(err))
    }),
    regenerateRecoveryCodes: useMutation({
      mutationFn: settingsApi.security.tfa.regenerateRecoveryCodes,
      onSuccess: (response)=> {
        queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
        toast.success(response.data.message || 'Regenerated successfully.!');
      },
      onError: (err)=> toast.error(getErrorsMessagesStr(err))
    })
  }

  // --- Sessions ---

  const revokeSession = useMutation({
    mutationFn: settingsApi.sessions.revoke,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
      toast.success(response.data.message || 'Session revoked');
    },
    onError: () => toast.error('Failed to revoke session'),
  });

  const revokeAllSessions = useMutation({
    mutationFn: settingsApi.sessions.revokeAll,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
      toast.success(response.data.message || 'All sessions revoked');
    },
    onError: () => toast.error('Revoke all sessions failed'),
  });

  const clearHistory = useMutation({
    mutationFn: settingsApi.sessions.clearHistory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
      toast.success(response.data.message || 'Session history cleared');
    },
    onError: () => toast.error('Clear history failed'),
  });

  return {
    // Profile
    updateProfile,
    updateAvatar,
    deleteAccount,
    // Security
    changePassword,
    deactivateAccount,
    // Sessions
    revokeSession,
    revokeAllSessions,
    clearHistory,
    tfa
  };
};
