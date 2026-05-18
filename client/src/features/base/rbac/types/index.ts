import type { RoleSchema, PermissionSchema } from '../../shared';

// Data Schema (re-export for consumers)
export type { RoleSchema, PermissionSchema };

// Search Query Params
export type FilterRolesParams = {
  page?:       number;
  search?:     string;
  group?:      string;
  permission?: string;
  all?:        boolean;
};

// UI Components
export type CreateRoleProps = {
  isOpen:  boolean;
  onClose: () => void;
};

// Form Values
export type RoleFormValues = {
  name:        string;
  permissions: string[];
};

// Request Payloads
export type StoreRolePayload = Pick<RoleSchema, 'name'> & {
  permissions?: string[];
};

export type UpdateRolePayload = Pick<RoleSchema, 'name'> & {
  permissions: string[];
};
