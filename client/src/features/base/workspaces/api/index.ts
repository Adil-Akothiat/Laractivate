import { api } from '@/app/services/api';
import { ApiResponseSchema } from '@/app/types';
import { SwitchWorkspaceResponseSchema, WorkspacesListResponseSchema } from '../types';

const BASE_ROUTE = '/user/workspaces';

export const workspaceApi = {
  switchWorkspace: (clientId: number) => api.post<ApiResponseSchema<SwitchWorkspaceResponseSchema>>(`${BASE_ROUTE}/switch`, { client_id: clientId }),
  list: async () => {
    const { data } = await api.get<ApiResponseSchema<WorkspacesListResponseSchema>>(`${BASE_ROUTE}`);
    return data.data;
  },
  create: async (name: string) => api.post<ApiResponseSchema<[]>>(`${BASE_ROUTE}`, { name }),
  verifySlug: async (slug: string)=> api.get<ApiResponseSchema<{verified:boolean}>>(`${BASE_ROUTE}/verify/${slug}`)
}