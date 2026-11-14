import { RoleSchema } from "@/entities/role/model/role.types";

export interface UserBaseSchema {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    avatar?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface UserSchema extends UserBaseSchema {
    is_active: boolean;
    owner?: boolean;
    two_factor_secret: string | null;
    two_factor_enabled: boolean;
    two_factor_recovery_codes: string[] | [];
    last_active_client_id?: string | null;
    rbac: {
        system_roles: RoleSchema[],
        client_role: RoleSchema,
        permissions: string[]
    }
}


// --- UI Props ---
export type EventConfigProps = {
    icon: React.ReactNode;
    label: string;
    iconBg: string;
    iconColor: string;
    badge: string;
};