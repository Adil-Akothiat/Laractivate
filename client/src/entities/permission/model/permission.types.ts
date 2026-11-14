export interface PermissionSchema {
  id: string
  name: string
  group: string
  is_locked: boolean
  created_at?: string
  updated_at?: string
}

export type PermissionGroupSchema = { [key: string]: PermissionSchema[] };

export interface PermissionResponseSchema {
  default: PermissionSchema,
  permissions: PermissionSchema[],
  grouped: PermissionGroupSchema
}