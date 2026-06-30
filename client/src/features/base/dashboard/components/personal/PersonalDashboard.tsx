import { WelcomeBanner } from "../shared/WelcomeBanner";
import type { PersonalDashboardData } from "@/features/base/dashboard/types";
import { PersonalStatsGrid } from "./PersonalStatsGrid";

type Props = { data: PersonalDashboardData };

export function PersonalDashboard({ data }: Props) {
    const { user, stats } = data;
    return (
        <>
            <WelcomeBanner user={user} />
            <PersonalStatsGrid stats={stats} />
        </>
    );
}