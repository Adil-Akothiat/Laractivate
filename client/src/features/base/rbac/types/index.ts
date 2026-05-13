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
    all?:boolean
}