import type { PaginationParams } from "@/app/types";

export const settingsKeys = {
  all: ['settings'] as const,

  // Profile
  profile: () => [...settingsKeys.all, 'profile'] as const,

  // Sessions
  sessions:    () => [...settingsKeys.all, 'sessions'] as const,

  // Activity Logs
  activityLogs:      () => [...settingsKeys.all, 'activity-logs'] as const,
  activityLogsList:  (page: number) => [...settingsKeys.activityLogs(), page] as const,

  // billing
  invoicesHistory: (params:PaginationParams) => [...settingsKeys.all, 'invoices', { params }] as const,
  subscriptionOverview: () => [...settingsKeys.all, 'subscription-overview'] as const,
};
