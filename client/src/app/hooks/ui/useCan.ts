import { useMe } from "../api/useAuthCoreQueries";
import { global } from "@/app/config/permissions.json"

export const useCan = () => {
  const { data:user } = useMe();
  // console.log(user);
  const can = (permission: string): boolean => {
    const permissions = user?.rbac.permissions;
    if (!permissions) return false;
    // 1. Super Admin Wildcard
    if (permissions.includes(global.all)) return true;

    // 2. Specific Permission Matching
    return permissions.includes(permission);
  };

  const canAny = (permissionsArray: string[]): boolean => {
    if(permissionsArray.includes(global.all)) return true;
   
    return permissionsArray.some((p) => can(p));
  };
  return { can, canAny };
};