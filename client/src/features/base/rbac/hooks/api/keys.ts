export const rbacKeys = {
  all:     ['rbac'] as const,

  // Roles
  roles:   () => [...rbacKeys.all, 'roles'] as const,
  rolesList: () => [...rbacKeys.roles(), 'list'] as const,
  roleList: (filters: any) => [...rbacKeys.rolesList(), { filters }] as const,
  roleDetails: () => [...rbacKeys.roles(), 'detail'] as const,
  roleDetail: (id: string) => [...rbacKeys.roleDetails(), id] as const,

  // Permissions
  permissions: () => [...rbacKeys.all, 'permissions'] as const,
};
