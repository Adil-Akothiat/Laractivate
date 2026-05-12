import { api } from "@/app/services/api";

const route = '/system/dashboard';
export const getUserDashboard = ()=> api.get(route);
export const getSuperAdminDashboard = ()=> api.get(route+'/super-admin');