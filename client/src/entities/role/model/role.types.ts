import { PermissionSchema } from "@/entities/permission/model/permission.types"

export interface RoleSchema {
  id: string
  name: string
  is_locked: boolean
  users_count?: number
  permissions?: PermissionSchema[]
  created_at?: string
  updated_at?: string
}