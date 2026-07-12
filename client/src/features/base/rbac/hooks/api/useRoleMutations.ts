import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacApi } from '../../api';
import { rbacKeys } from './keys';
import { useToastContext } from '@/app/hooks/common';
import { getErrorsMessagesStr } from '@/app/utils';

export const useRoleMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToastContext();

  // --- Roles ---

  const create = useMutation({
    mutationFn: rbacApi.roles.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.rolesList() });
      toast.success(response.data.message || 'Role created successfully');
    },
    onError: (error: any) => {
      toast.error(getErrorsMessagesStr(error));
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      rbacApi.roles.update(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.roleDetail(id) });
      queryClient.invalidateQueries({ queryKey: rbacKeys.rolesList() });
      toast.success(response.data.message || 'Role updated');
    },
    onError: (err) => toast.error(getErrorsMessagesStr(err)),
  });

  const remove = useMutation({
    mutationFn: rbacApi.roles.remove,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.rolesList() });
      toast.success(response.data.message || 'Role deleted');
    },
    onError: (err) => toast.error(getErrorsMessagesStr(err)),
  });

  return {
    create,
    update,
    remove,
  };
};
