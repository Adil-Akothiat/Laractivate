import { LayoutDashboard, UserPlus, Users } from "lucide-react";
import { Breadcrumb, Button } from "../../../../../components";
import FilterAndSearchAccounts from "./FilterAndSearchAccounts";
import { Can } from "../../../../../components/Guard/Can";
import type { RoleProps } from "../../../rbac";

type Props = {
    newAccountHandler: () => void;
    searchResult?:number;
    roles:RoleProps[]
}
export default function AccountsHeader({ newAccountHandler, searchResult=0, roles }: Props) {
    return (
        <div className="py-3">
            <Breadcrumb 
                items={[
                    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
                    { label: "Accounts", href: "/accounts", icon: <Users size={16} /> },
                ]}
            />
            <h1 className="text-2xl font-bold text-base-content">Accounts</h1>
            <Can 
                permission={["all","accounts.manage"]}
                fallback={
                    <p className="text-sm text-base-content/50 mt-1">
                        You can't edit or manage accounts. Contact your administrator for more information.
                    </p>
                }
            >
                <p className="text-sm text-base-content/50 mt-1">
                    Manage user accounts, roles, and permissions. Create new accounts, assign roles, and control access to your system.
                </p>
            </Can>
            <div className="flex justify-between items-center mt-4 flex-wrap">
                <div className="flex items-center">
                    <FilterAndSearchAccounts roles={roles}/>
                    <p className="border-l text-sm pl-2">Result: {searchResult}</p>
                </div>
                <Can permission={["all","accounts.manage"]}>
                <Button
                    leftIcon={<UserPlus size={16} />}
                    size="sm"
                    onClick={newAccountHandler}
                >New Account</Button>
                </Can>
            </div>
        </div>
    );
}