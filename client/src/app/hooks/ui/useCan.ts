import { useMe } from "../api/useAuthCoreQueries";

export const useCan = () => {
  const { data:user } = useMe();
  // console.log(user);
  const can = (permission: string): boolean => {
    const permissions = user?.rbac.permissions;
    if (!permissions) return false;
    // 1. Super Admin Wildcard
    if (permissions.includes("all")) return true;

    // 2. Specific Permission Matching
    return permissions.includes(permission);
  };

  const canAny = (permissionsArray: string[]): boolean => {
    // console.log(permissionsArray);
    // console.log(user?.rbac.permissions);
    return permissionsArray.some((p) => can(p));
  };
  return { can, canAny };
};