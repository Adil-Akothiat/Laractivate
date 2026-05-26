export interface PermissionSchema {
  id: string
  name: string
  group: string
  is_locked: boolean
  created_at?: string
  updated_at?: string
}

export type PermissionGroupSchema = {[key:string]: PermissionSchema[]};

export interface PermissionResponseSchema {
  default: PermissionSchema,
  permissions: PermissionSchema[],
  grouped: PermissionGroupSchema
}

export interface RoleSchema {
  id: string
  name: string
  is_locked: boolean
  users_count?: number
  permissions?: PermissionSchema[]
  created_at?: string
  updated_at?: string
}

export interface UserSchema {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  roles?:RoleSchema[];
  rolesSet:string[];
  permissionsSet: string[];
  permissions: PermissionSchema[];
  is_active: boolean;
  owner?: boolean;
  two_factor_secret: string|null;
  two_factor_enabled: boolean;
  two_factor_recovery_codes: string[]|[];
  created_at?: string;
  updated_at?: string;
}


export interface SessionSchema {
    session_id:       number;
    user_id:         string;
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

export interface SessionResponseSchema {
    active:  SessionSchema[];
    history: SessionSchema[];
}

export interface LogPropertiesSchema {
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

export interface LogSchema {
    id: number;
    user_id: string;
    description: string;
    event: string;
    properties: LogPropertiesSchema | null;
    ip_address: string;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
};



// --- UI Props ---
export type EventConfigProps = {
  icon:      React.ReactNode;
  label:     string;
  iconBg:    string;
  iconColor: string;
  badge:     string;
};