// export const twoFactorKeys = {
//   all: ['accounts'] as const,
//   lists: () => [...twoFactorKeys.all, 'list'] as const,
//   list: (filters: any) => [...twoFactorKeys.lists(), { filters }] as const,
//   details: () => [...twoFactorKeys.all, 'detail'] as const,
//   detail: (id: string) => [...twoFactorKeys.details(), id] as const,
//   sessions: (id: string) => [...twoFactorKeys.detail(id), 'sessions'] as const,
//   logs: (id: string, page: number) => [...twoFactorKeys.detail(id), 'logs', page] as const
// };