import { useMe } from "../api/useAuthCoreQueries";

export const useCan = () => {
  const { data:user } = useMe();

  const can = (permission: string): boolean => {
    const permissions = user?.permissionsSet;
    if (!permissions) return false;
    
    // 1. Super Admin Wildcard
    if (permissions.includes("all")) return true;

    // 2. Specific Permission Matching
    return permissions.includes(permission);
  };

  const canAny = (permissionsArray: string[]): boolean => {
    return permissionsArray.some((p) => can(p));
  };

  return { can, canAny };
};