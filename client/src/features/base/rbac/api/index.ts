import { api } from "../../../../app/services/api";
import type { FilterRolesParams, StoreRolePayload, UpdateRolePayload } from "../types";

const route = '/access/rbac';
export const getRoles = ({ page = 1, search, group, permission }: FilterRolesParams = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (search)     params.set('search',     search);
    if (group)      params.set('group',      group);
    if (permission) params.set('permission', permission);

    return api.get(`${route}/roles?${params.toString()}`);
};
export const getRole = (id: string) => api.get(`${route}/roles/${id}`);
export const getPermissions = () => api.get(`${route}/permissions`);
export const createRole = (payload: StoreRolePayload) =>
    api.post(`${route}/roles`, payload);
export const updateRole = (id: string, payload: UpdateRolePayload) =>
    api.put(`${route}/roles/${id}`, payload);
export const deleteRole = (id: string) =>
    api.delete(`${route}/roles/${id}`);