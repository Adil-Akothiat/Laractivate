import type { PermissionProps, RoleProps } from "../../rbac";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  roles?:RoleProps[];
  rolesSet:string[];
  permissionsSet: string[];
  permissions: PermissionProps[];
  is_active?: boolean;
  owner?: boolean;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface AccountActionPayload {
  password: string;
}

export interface UserSession {
    session_id:       number;
    users_id:         string;
    device:           string;
    device_name?:     string;
    browser:          string;
    browser_version?: string;
    platform:         string;
    platform_version?:string;
    ip_address:       string;
    city?:            string;
    country?:         string;
    timezone?:        string;
    user_agent?:      string;
    is_current:       boolean;
    is_active:        boolean;
    revoked:          boolean;
    last_active:      string;
}

export interface SessionsData {
    active:  UserSession[];
    history: UserSession[];
}

export interface LogPropertiesProps {
    ip?: string;
    city?: string;
    country?: string;
    device?: string;
    browser?: string;
    platform?: string;
    timezone?: string;
    user_agent?: string;
    device_name?: string;
    browser_version?: string | null;
    platform_version?: string;
    email?: string;
    old?: Record<string, string | null>;
    new?: Record<string, string | null>;
};

export interface ActivityLogProps {
    id: number;
    users_id: string;
    description: string;
    event: string;
    properties: LogPropertiesProps | null;
    ip_address: string;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
};

// ─── Event Config ─────────────────────────────────────────────────────────────

export interface EventConfigProps {
    icon: React.ReactNode;
    label: string;
    iconBg: string;
    iconColor: string;
    badge: string;
};