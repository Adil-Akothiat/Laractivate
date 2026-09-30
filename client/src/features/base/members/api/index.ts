import { api } from '@/app/services/api';
import { PaginatedResponseSchema } from '@/app/types';
import { FilterMembersParams, MemberSchema } from '../types';

const BASE_ROUTE = '/user/workspace/members';

export const memberApi = {
  // --- Core CRUD ---
  list: (params:FilterMembersParams) =>
    api.get<PaginatedResponseSchema<MemberSchema>>(BASE_ROUTE, { params })
};