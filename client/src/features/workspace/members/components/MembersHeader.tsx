import { Breadcrumb, Button } from "@/components"
import { LayoutDashboard, UserGroup, UserPlus } from "lucide-react";
import FilterAndSearchMembers from "./FilterAndSearchMembers";

type MembersHeaderProps = {
    searchResult?:number;
    inviteMemberHandler: ()=> void;
}

export default function MembersHeader({ searchResult=0, inviteMemberHandler }:MembersHeaderProps) {
    return (
        <div>
            <Breadcrumb 
                items={
                    [
                        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
                        { label: "Members", href: "/members", icon: <UserGroup size={16} /> },
                    ]
                }
            />
            <div>
                <h1 className="text-2xl font-bold text-base-content">Members</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    Manage members and control what each member can do by inviting them.
                </p>
            </div>
            <div className="flex justify-between items-center mt-4 flex-wrap">
                <div className="flex items-center">
                    <FilterAndSearchMembers />
                    <p className="border-l text-sm pl-2">Result: {searchResult}</p>
                </div>
                <Button
                    leftIcon={<UserPlus size={16} />}
                    size="sm"
                    onClick={inviteMemberHandler}
                >
                    Invite
                </Button>
            </div>
        </div>
    );
}