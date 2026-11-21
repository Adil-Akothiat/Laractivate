export const getLocalWorkspaceSlug = (): string => {
    const workspaceSlug = window.localStorage.getItem('workspace_slug') ?? '';
    return workspaceSlug;
}