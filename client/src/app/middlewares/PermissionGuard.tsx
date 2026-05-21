import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCan } from '../hooks/ui/useCan';
import { GlobalPageLoader } from '@/components/Loaders/Loaders';
import { useMe } from '../hooks';

type Props = {
    permission:string|string[];
    children:ReactNode;
}

const PermissionGuard = ({ permission, children }:Props) => {
    const { data, isPending, isError } = useMe();
    const { can, canAny } = useCan();
    const location = useLocation();
    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if(isError || !data) return <Navigate to="/login" replace />;
    
    const hasAccess = Array.isArray(permission) ? canAny(permission) : can(permission);
    if (!hasAccess) {
        return <Navigate to="/403" state={{ from: location }} replace />;
    }
    return children;
};

export default PermissionGuard;