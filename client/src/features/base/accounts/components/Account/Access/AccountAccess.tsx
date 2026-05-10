import type { User } from "../../../../settings";
import AccountPermissions from "./AccountPermissions";
import AccountRoles from "./AccountRoles";

interface Props {
    user: User;
}

export default function AccountAccess({ user }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <AccountRoles      user={user} />
            <AccountPermissions permissions={user.permissions} />
        </div>
    );
}