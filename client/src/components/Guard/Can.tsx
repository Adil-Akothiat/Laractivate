import React from 'react';
import { useCan } from '@/app/middlewares/hooks/useCan';

interface CanProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const Can = ({ permission, children, fallback = null }: CanProps) => {
    const { can, canAny } = useCan();
    
    // Determine access based on string or array
    const hasAccess = Array.isArray(permission) 
        ? canAny(permission) 
        : can(permission);
    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};