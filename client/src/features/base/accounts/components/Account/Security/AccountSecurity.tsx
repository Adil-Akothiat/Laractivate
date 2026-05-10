import AccountPasswordCard   from "./AccountPasswordCard";
import AccountTwoFactorCard  from "./AccountTwoFactorCard";

interface Props {
    user: any;
}

export default function AccountSecurity({ user }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <AccountPasswordCard />
            <AccountTwoFactorCard user={user} />
        </div>
    );
}