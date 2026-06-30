export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters: any) => [...accountKeys.lists(), { filters }] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  sessions: (id: string) => [...accountKeys.detail(id), 'sessions'] as const,
  logs: (id: string, page: number) => [...accountKeys.detail(id), 'logs', page] as const,
  invoices: (id: string, page: number) => [...accountKeys.detail(id), 'invoices', page] as const
};