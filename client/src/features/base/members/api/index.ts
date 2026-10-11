import { api } from '@/app/services/api';
import { ApiResponseSchema, PaginatedResponseSchema } from '@/app/types';
import { FilterMembersParams, InviteMemberPayload, MemberSchema } from '../types';

const BASE_ROUTE = '/user/workspace/members';

export const memberApi = {
  // --- Core CRUD ---
  list: (params:FilterMembersParams) =>
    api.get<PaginatedResponseSchema<MemberSchema>>(BASE_ROUTE, { params }),
  invite: (payload:InviteMemberPayload) => 
    api.post<ApiResponseSchema<null>>(`${BASE_ROUTE}/invite`, payload)
};