import type { PaginationParams, PasswordSchema } from "@/app/types";
import type { UserSchema } from "../../shared";

// Data Schema


// Search Queries Params
export interface FilterAccountsParams extends PaginationParams {
    role?: string;
    status?: string;
};

// ui components
export type CreateAcccountProps = {
  isOpen: boolean;
  onClose: () => void;
}

// Forms values
export type AccountFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    rolesState: string[];
    isActive: boolean;
}


// Request Payload
export type UserCreatePayload = Pick<UserSchema, 'first_name'|'last_name'|'email'|'is_active'|'avatar'|'rolesSet'>&PasswordSchema;

export type UserUpdatePayload = Pick<UserSchema, 'first_name'|'last_name'|'email'|'is_active'|'rolesSet'|'avatar'>&PasswordSchema;