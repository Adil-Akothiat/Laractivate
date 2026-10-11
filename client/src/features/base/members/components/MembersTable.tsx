import { ScrollContainer } from "@/components/ScrollContainer";
import MembersHeader from "./MembersHeader";
import { useMembersQueries } from "../hooks/api/useMemberQueries";
import { DataTable } from "@/components/Table";
import { MemberSchema } from "../types";
import { memberColumns } from "./MemberColumns";
import { useState } from "react";
import { Pagination } from "@/components";
import { useMembersFilter } from "../hooks/ui/useMembersFilter";
import InviteMember from "./InviteMember";

export default function MembersTable() {
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const { search, status } = useMembersFilter();
    const { data, isPending } = useMembersQueries.list({ page:1, search, status });
    const response = data?.data;
    const members = response?.data || [];
    const meta = response?.meta;
    console.log(members);
    return (
        <ScrollContainer>
            <MembersHeader 
                searchResult={meta?.total}
                inviteMemberHandler={()=> setOpen(true)}
            />
            <InviteMember 
                open={open}
                onClose={()=> setOpen(false)}
            />
            <DataTable<MemberSchema>
                pinRows
                loading={isPending}
                data={members}
                skeletonRows={5}
                emptyMessage="You don't have any members yet."
                columns={memberColumns}
                keyExtractor={(row:MemberSchema)=> row.id}
                //  actions={[
                //     {
                //         permission: "roles.manage",
                //         label:      "Edit",
                //         onClick:    (role) => setModal({ type: "edit", roleId: role.id }),
                //     },
                //     {
                //         permission: "roles.manage",
                //         label:      "Delete",
                //         className:  "text-error",
                //         hidden:     (role) => !!role.is_locked,
                //         onClick:    (role) => setModal({ type: "delete", roleId: role.id }),
                //     },
                // ]}
            />
            <Pagination
                currentPage={page}
                totalPages={meta?.last_page || 1}
                total={meta?.total || 0}
                perPage={meta?.per_page}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </ScrollContainer>
    );
}