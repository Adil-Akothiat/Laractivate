import { GlobalPageLoader } from '@/components/ui/feedback/Loaders';
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMe } from '../hooks';
import { useCan } from '../hooks/ui/useCan';

type Props = {
    permission: string | string[];
    children: ReactNode;
}

export function PermissionGuard({ permission, children }: Props) {
    const { data, isPending, isError } = useMe();
    const { can, canAny } = useCan();
    const location = useLocation();

    if (isPending) return <GlobalPageLoader isLoading={isPending} />;
    if (isError || !data) return <Navigate to="/login" replace />;

    const hasAccess = Array.isArray(permission) ? canAny(permission) : can(permission);
    if (!hasAccess) {
        return <Navigate to="/403" state={{ from: location }} replace />;
    }
    return children;
};