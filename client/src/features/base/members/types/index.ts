import { PaginationParams } from "@/app/types";
import { RoleSchema, UserBaseSchema } from "../../shared";

export interface MemberSchema extends UserBaseSchema{
    membership: string;
    role: Pick<RoleSchema, 'id'|'name'> & { permissions:string[] };
    joined_at: string|null;
}


export interface FilterMembersParams extends PaginationParams {
    status: string;
};

export interface MembersFilterParams {
    page: number;
    search: string;
    status: string;
    joined: string;
}
