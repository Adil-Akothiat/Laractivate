import { useQuery } from '@tanstack/react-query';
import { rbacApi } from '../../api';
import { rbacKeys } from './keys';
import type { FilterRolesParams } from '../../types';

export const useRoles = (params: FilterRolesParams) => {
  return useQuery({
    queryKey: rbacKeys.roleList(params),
    queryFn:  () => rbacApi.roles.list(params),
    placeholderData: (previousData) => previousData,
    select: (res)=> res.data
  });
};

export const useRole = (id: string | undefined) => {
  return useQuery({
    queryKey: rbacKeys.roleDetail(id!),
    queryFn:  () => rbacApi.roles.get(id!),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    select: (res)=> res.data.data
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: rbacKeys.permissions(),
    queryFn:  () => rbacApi.permissions.list(),
    select: (res)=> res.data.data,
    staleTime: 10 * 60 * 1000, // permissions are rarely updated
  });
};
