import { Crown, ShieldCheck, ShieldOff } from "lucide-react";
import { imageRender } from "../../../../../app/utils/imagePreviewHandler";
import { Avatar, Badge, type Column } from "../../../../../components";
import type { ManagedUser } from "../../types";

export const columns: Column<ManagedUser>[] = [
  {
    key:    'first_name',
    header: 'User',
    render: (row:ManagedUser) => {
      const fullName = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim();
      const initials = [row.first_name, row.last_name]
        .filter(Boolean)
        .map((n) => n!.charAt(0).toUpperCase())
        .join('');
      return (
        <div className="flex items-center gap-2.5">
          <Avatar
            src={imageRender(row.avatar) ?? undefined}
            initials={initials || '?'}
            size="sm"
            shape="circle"
          />
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm text-base-content">
              {fullName || '—'}
            </span>
            {row.owner && (
              <span className="badge badge-warning badge-sm gap-1">
                <Crown size={9} /> Owner
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key:    'email',
    header: 'Email',
    render: (row:ManagedUser) => (
      <span className="text-sm text-base-content/60">{row.email ?? '—'}</span>
    ),
  },
  {
    key:    'roles',
    header: 'Roles',
    render: (row:ManagedUser) => (
      <div className="flex flex-wrap gap-1">
        {
          row.roles?.length ?
          (
            row.rolesSet.map((role, index)=> <Badge key={index} size="xs" variant='info' outline={true}>{role}</Badge>)
          )
          :
          <span className="text-xs text-base-content/30">No roles</span>
        }
      </div>
    ),
  },
  {
    key:    'is_active',
    header: 'Status',
    render: (row:ManagedUser) =>
      row.is_active ? (
        <span className="badge badge-success badge-sm gap-1">
          <ShieldCheck size={10} /> Active
        </span>
      ) : (
        <span className="badge badge-ghost badge-sm gap-1">
          <ShieldOff size={10} /> Inactive
        </span>
      ),
  },
];
