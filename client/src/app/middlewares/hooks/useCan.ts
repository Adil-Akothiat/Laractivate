import { useMe } from './useMe';

export const useCan = () => {
    const { data } = useMe();
    const user = data?.user;
    /**
     * Check if the user has a specific permission.
     */
    const can = (permission: string): boolean => {
        // Safe check: if user or permissionsSet isn't loaded, they can't do anything
        const permissions = user?.permissionsSet;
        if (!permissions) return false;

        // 1. Super Admin Wildcard
        if (permissions.includes('all')) return true;

        // 2. Specific Check
        return permissions.includes(permission);
    };

    /**
     * Check if the user has ANY of the provided permissions.
     */
    const canAny = (permissionsArray: string[]): boolean => {
        return permissionsArray.some(p => can(p));
    };

    // ALWAYS return the object so destructuring { can, canAny } never fails
    return { can, canAny };
};