import { useQuery } from "@tanstack/react-query";
import { getSuperAdminDashboard, getUserDashboard } from "../api";
import { useMe } from "@/app/middlewares/hooks/useMe";

export const useDashboard = () => { 
  const { data } = useMe();
  const user = data?.user;
  const userRoles: string[] = user?.rolesSet || [];
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN');
  return useQuery({
    queryKey: ["dashboard", isSuperAdmin ? 'SUPER_ADMIN' : 'MEMBER'],
    queryFn: ()=> isSuperAdmin ? getSuperAdminDashboard() : getUserDashboard(),
    retry: false,
  });
};