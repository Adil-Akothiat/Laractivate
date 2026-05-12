export interface PermissionProps {
  id: string
  name: string
  group: string
  is_locked: boolean
  created_at?: string
  updated_at?: string
}

export interface RoleProps {
  id: string
  name: string
  is_locked: boolean
  users_count?: number
  permissions?: PermissionProps[]
  created_at?: string
  updated_at?: string
}

export interface UserProps {
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