import { useState } from "react";
import AccountProfileCard      from "./AccountProfileCard";
import AccountProfileEditModal from "./AccountProfileEditModal";
import type { UserProps } from "@/features/base/shared";

type Props = { user: UserProps };

export default function AccountProfile({ user }: Props) {
    const [open, setOpen] = useState(false);

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