import { DataTable, Pagination } from "@/components";
import { useGetWorkspacePermissions } from "../api";
import { useGetWorkspaceRoles } from "../api/getWorkspaceRoles.api";
import { RoleSchema, WorkspaceRolesTableProps } from "../model";
import { roleColumns } from "../model/roleColumns";

export function WorkspaceRolesTable({ actions, filterQueries }: WorkspaceRolesTableProps) {
    const { page, search, sort, order, setFilters } = filterQueries;
    const { data, isPending: rolesPending } = useGetWorkspaceRoles({ page, search, sort, order });
    const { isPending: permissionsPending } = useGetWorkspacePermissions();
    const isPending = rolesPending || permissionsPending;
    const roles = data?.data || [];
    const meta = data?.meta;

    return (
        <>
            <DataTable<RoleSchema>
                pinRows
                columns={roleColumns()}
                actions={actions}
                data={roles || []}
                keyExtractor={(role) => role.id}
                loading={isPending}
                skeletonRows={5}
                emptyMessage="No roles yet. Create your first role to get started."
            />
            <Pagination
                currentPage={page}
                totalPages={meta?.last_page ?? 1}
                total={meta?.total ?? 0}
                perPage={meta?.per_page ?? 10}
                onPageChange={(newPage) => setFilters({ page: newPage })}
            />
        </>
    );
}