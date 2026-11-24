import { SetStateProps } from "@/app/types";
import { FilterQueriesProps, RoleSchema } from "@/entities";


// UI Components
export type CreateRoleProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Form Values
export type RoleFormValues = {
  name: string;
  permissions: string[];
};

// 1. Define the shared structure once
export type RolePayload = Pick<RoleSchema, 'name'> & {
  permissions?: string[];
};

// 2. Bind both Store and Update to the base type
export type StoreRolePayload = RolePayload;
export type UpdateRolePayload = RolePayload & { id: string };



export interface ManageRolesStatesProps {
  modalOpened: boolean;
}

export interface ManageRolesProps {
  modalOpen: boolean;
  setModalOpen: SetStateProps<boolean>;
  attachedPermissions: string[];
  setAttachedPermissions: SetStateProps<string[]>;
  onAttachAllHandler: (permissions: string[]) => void;
  onAttachHandler: (id: string) => void;
  name: string;
  setName: SetStateProps<string>;
  resetForm: () => void;
  role: RoleSchema | null;
  setRole: SetStateProps<RoleSchema | null>;
  confirmModalOpen: boolean;
  setConfirmModalOpen: SetStateProps<boolean>;
}

export interface WorkspaceRoleContextProps {
  filterQueries: FilterQueriesProps & { setFilters: (filters: FilterQueriesProps) => void };
  manageRoleStates: ManageRolesProps;
}

