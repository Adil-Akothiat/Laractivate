import type { UserProps } from "@/features/base/shared";


type Props = {
    user: UserProps;
};

const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

export function WelcomeBanner({ user }: Props) {
    return (
        <div className="px-1 py-2">
            <h1 className="text-2xl font-bold text-base-content">Dashboard</h1>
            <p className="text-sm text-base-content/50 mt-1">
                {greeting}, {user.first_name} {user.last_name}. Here's what's happening with your business today.
            </p>
        </div>
    );
}