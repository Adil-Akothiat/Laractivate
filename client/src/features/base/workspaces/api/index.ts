import { api } from '@/app/services/api';
import { ApiResponseSchema } from '@/app/types';
import { SwitchWorkspaceResponseSchema } from '../types';

const BASE_ROUTE = '/user/workspaces';

export const workspaceApi = {
  switchWorkspace: (clientId: number)=>  api.post<ApiResponseSchema<SwitchWorkspaceResponseSchema>>(`${BASE_ROUTE}/switch-workspace`, { client_id: clientId }),
  list: async ()=> {
    const { data } = await api.get<ApiResponseSchema<[]>>(`${BASE_ROUTE}`);
    return data.data;
  },
  create: async (name:string)=> api.post<ApiResponseSchema<[]>>(`${BASE_ROUTE}`, { name })
}