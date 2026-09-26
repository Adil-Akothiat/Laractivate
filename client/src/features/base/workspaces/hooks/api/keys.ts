export const clientKeys = {
    workspaces: ['workspaces'] as const,
    clientsId: (id: number) => [...clientKeys.workspaces, id],
}