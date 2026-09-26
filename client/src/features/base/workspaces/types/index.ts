export interface WorkspaceSchema {
  id: number;
  name: string;
  slug: string;
}

export interface SwitchWorkspaceResponseSchema {
  active_workspace: WorkspaceSchema
}