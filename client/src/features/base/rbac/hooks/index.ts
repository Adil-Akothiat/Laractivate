import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FilterRolesParams, StoreRolePayload, UpdateRolePayload } from '../types'
import { createRole, deleteRole, getPermissions, getRole, getRoles, updateRole } from '../api'
import { useSearchParams } from 'react-router-dom';

export const useRoles = {
  getRoles: ({ page = 1, search, group, permission, all }: FilterRolesParams = {}) =>
    useQuery({
        queryKey: ['roles', page, search, group, permission, all],
        queryFn:  () => getRoles({ page, search, group, permission, all }).then(res => res.data),
    }),

  getRole: (id: string, options = {}) => useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRole(id).then(res => res.data),
    ...options
  }),

  create: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: StoreRolePayload) => createRole(payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
    });
  },

  update: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) => updateRole(id, payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
    });
  },

  delete: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deleteRole(id),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
    });
  },
}

export const usePermissions = {
  getPermissions: () => useQuery({
    queryKey: ['permissions'],
    queryFn: () => getPermissions().then(res => res.data),
  }),
}

export const useRolesFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page       = Number(searchParams.get("page") || 1);
    const search     = searchParams.get("search")     || "";
    const group      = searchParams.get("group")      || "";
    const permission = searchParams.get("permission") || "";

    const setFilters = (
        filters: Partial<{
            page:       number;
            search:     string;
            group:      string;
            permission: string;
        }>,
    ) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(filters).forEach(([key, value]) => {
                if (value) next.set(key, String(value));
                else next.delete(key);
            });

            // reset page when filters change
            if (Object.keys(filters).some((k) => k !== "page")) {
                next.set("page", "1");
            }

            return next;
        });
    };

    return { page, search, group, permission, setFilters };
};