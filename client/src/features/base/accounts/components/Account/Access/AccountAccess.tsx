import type { UserSchema } from "@/features/base/shared";
import AccountPermissions from "./AccountPermissions";
import AccountRoles from "./AccountRoles";

interface Props {
    user: UserSchema;
}

export default function AccountAccess({ user }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <AccountRoles      user={user} />
            <AccountPermissions permissions={user.permissions} />
        </div>
    );
}