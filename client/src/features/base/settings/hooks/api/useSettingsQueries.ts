import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../api';
import { settingsKeys } from './keys';

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
