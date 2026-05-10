import { useState } from "react";
import type { User } from "../../../../settings";
import AccountProfileCard      from "./AccountProfileCard";
import AccountProfileEditModal from "./AccountProfileEditModal";

type Props = { user: User };

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