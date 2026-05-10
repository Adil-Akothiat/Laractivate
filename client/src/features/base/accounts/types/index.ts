import type { RoleProps } from "../../rbac";

export interface ManagedUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: RoleProps[];
    rolesSet: string[];
    permissionSet: string[];
    owner?: boolean;
    avatar?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_active?: boolean;
    roles?: string[];
    avatar?: string;
}

export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    is_active?: boolean;
    roles?: string[];
    avatar?: string;
}

export type FilterAccountsParams = {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
};