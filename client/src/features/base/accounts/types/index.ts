import type { PasswordSchema } from "@/app/types";
import type { RoleSchema, UserSchema } from "../../shared";

// Data Schema


// Search Queries Params
export type FilterAccountsParams = {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
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