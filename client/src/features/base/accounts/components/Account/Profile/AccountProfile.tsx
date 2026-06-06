import { useState } from "react";
import AccountProfileCard      from "./AccountProfileCard";
import AccountProfileEditModal from "./AccountProfileEditModal";
import type { UserSchema } from "@/features/base/shared";
import { useAccountInvoices } from "@/features/base/accounts/hooks";

type Props = { user: UserSchema };

export default function AccountProfile({ user }: Props) {
    const [open, setOpen] = useState(false);
    const { data } = useAccountInvoices(user.id, 1);
    console.log(data);
    return (
        <>
            <AccountProfileCard user={user} onEdit={() => setOpen(true)} />
            <AccountProfileEditModal
                user={user}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}