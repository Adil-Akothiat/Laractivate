import { formatAbsoluteOrRelative } from "@/app/utils/dates";
import { Column } from "@/components";
import { RoleSchema } from "./role.types";

export const roleColumns = (): Column<RoleSchema>[] => [
    {
        key: "name",
        header: "Name",
        render: (role: RoleSchema) => <span className="font-medium">{role.name}</span>,
    },
    {
        key: "users_count",
        header: "Users",
        headerClassName: "text-center",
        className: "text-center",
        render: (role: RoleSchema) => (
            <span className="badge badge-ghost">{role.users_count ?? 0}</span>
        ),
    },
    {
        key: "scope",
        header: "Scope",
        headerClassName: "text-center",
        className: "text-center",
        render: (role: RoleSchema) => (
            <span className="badge badge-ghost">{role.scope}</span>
        ),
    },
    {
        key: "created_at",
        header: "Created at",
        headerClassName: "text-center",
        className: "text-center",
        render: (role) => role.created_at ? <span className="text-sm text-gray-600">{formatAbsoluteOrRelative(role.created_at)}</span> : <span className="text-sm text-gray-600">-</span>
    },
    {
        key: "updated_at",
        header: "Updated at",
        headerClassName: "text-center",
        className: "text-center",
        render: (role) => role.updated_at ? <span className="text-sm text-gray-600">{formatAbsoluteOrRelative(role.updated_at ?? "")}</span> : <span className="text-sm text-gray-600">-</span>
    }
];