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


// POST /roles
export interface StoreRolePayload {
  name: string
  permissions?: string[]
}

// PUT /roles/:id
export interface UpdateRolePayload {
  name: string
  permissions: string[]
}

export interface FilterRolesParams {
    page?:       number;
    search?:     string;
    group?:      string;
    permission?: string;
}