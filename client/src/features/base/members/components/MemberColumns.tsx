import { Crown, ShieldCheck, ShieldOff } from "lucide-react";
import { imageRender } from "@/app/utils/imagePreviewHandler";
import { Avatar, Badge, type Column } from "@/components";
import { MemberSchema } from "../types";

export const memberColumns: Column<MemberSchema>[] = [
  {
    key: 'member',
    header: 'Member',
    render: (row: MemberSchema) => {
      const fullName = row.full_name || `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim();
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
          <div>
            <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm text-base-content">
                {fullName || '—'}
                </span>
                {row.membership === 'owner' && (
                <span className="badge badge-warning badge-sm gap-1">
                    <Crown size={9} /> Owner
                </span>
                )}
            </div>
            <div>
                <span className="text-gray-400 font-sm">{row.email}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: 'role',
    header: 'Assigned Role',
    render: (row: MemberSchema) => (
      <div>
        {row.role?.name ? (
          <Badge size="xs" variant="info" outline>
            {row.role.name}
          </Badge>
        ) : (
          <span className="text-xs text-base-content/30">No role</span>
        )}
      </div>
    ),
  },
  {
    key: 'is_active',
    header: 'Status',
    render: (row: MemberSchema) =>
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
  {
    key:"joined_at",
    header: 'Joined/Created',
    render: (row: MemberSchema)=> row.joined_at
  }
];