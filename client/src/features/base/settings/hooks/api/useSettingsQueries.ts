import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api';
import { settingsKeys } from './keys';
import type { PaginationParams } from '@/app/types';

export const useProfile = () =>
  useQuery({
    queryKey: settingsKeys.profile(),
    queryFn:  () => settingsApi.profile.get(),
    select:   (res) => res.data.data,
  });

export const useUserSessions = () =>
  useQuery({
    queryKey: settingsKeys.sessions(),
    queryFn:  () => settingsApi.sessions.list(),
    select:   (res) => res.data.data,
    retry:    false,
  });

export const useProfileActivityLogs = (page = 1) =>
  useQuery({
    queryKey: settingsKeys.activityLogsList(page),
    queryFn:  () => settingsApi.activityLogs.list(page),
    select:   (res) => res.data,
    retry:    false,
  });

  export const useInvoicesHistory = (params:PaginationParams) =>
  useQuery({
    queryKey: settingsKeys.invoicesHistory(params),
    queryFn:  () => settingsApi.billing.invoicesHistory(params),
    select:   (res) => res.data,
    retry:    false,
  });


  export const useSubscriptionOverview = () =>
  useQuery({
    queryKey: settingsKeys.subscriptionOverview(),
    queryFn:  () => settingsApi.billing.getSubscriptions(),
    select:   (res) => res.data.data,
    retry:    false,
  });
