export interface WorkspaceSchema {
  id: number;
  name: string;
  slug: string;
}

export interface SwitchWorkspaceResponseSchema {
  active_workspace: WorkspaceSchema,
  redirect_path: string;
}

export interface WorkspacesListResponseSchema {
  workspaces: WorkspaceSchema[],
  current_client_id: number
}