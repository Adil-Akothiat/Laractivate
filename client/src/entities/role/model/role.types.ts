import { Action } from "@/components";
import { PermissionSchema } from "@/entities/role/model/permission.types";

export interface RoleSchema {
  id: string
  name: string
  scope: "client" | "system"
  is_locked: boolean
  users_count?: number
  permissions?: PermissionSchema[]
  created_at?: string
  updated_at?: string
}

export interface FilterQueriesProps {
  page?: number;
  search?: string;
  order?: string;
  sort?: string;
}

export interface WorkspaceRolesTableProps {
  actions: Action<RoleSchema>[];
}