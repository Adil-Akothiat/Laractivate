import { FilterMembersParams } from "../../types";


export const memberKeys = {
    members: ['members'] as const,
  membersList: (filters: FilterMembersParams) => [...memberKeys.members, { filters }] as const,
};