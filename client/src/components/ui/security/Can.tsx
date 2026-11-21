import { useCan } from '@/app/hooks/ui/useCan';
import React from 'react';

interface CanProps {
    permission?: string | null;
    permissions?: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const Can = ({ permission = null, permissions = [], children, fallback = null }: CanProps) => {
    const { can, canAny } = useCan();
    let hasAccess = false;
    if (permissions.length > 0) {
        hasAccess = canAny(permissions);
    }
    if (permission) {
        hasAccess = can(permission);
    }

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};