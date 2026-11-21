export interface PermissionSchema {
  id: string
  name: string
  group: string
  is_locked: boolean
  created_at?: string
  updated_at?: string
}

// export type PermissionGroupSchema = { [key: string]: PermissionSchema[] };

export type FilterRolesParams = {
  page?: number;
  search?: string;
  order?: string;
  sort?: string;
  all?: boolean;
};

export interface GroupedPermissionsSchema {
  group: string;
  permissions: PermissionSchema[];
}
export interface PermissionResponseSchema {
  groupedPermissions: GroupedPermissionsSchema[];
  permissions: PermissionSchema[];
}



                