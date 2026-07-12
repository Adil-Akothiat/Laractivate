import { WelcomeBanner } from "../shared/WelcomeBanner";
import { RecentActivity } from "../shared/RecentActivity";
import { SystemStatsGrid } from "./SystemStatsGrid";
import { UserComposition } from "./UserComposition";
import { SystemHealth } from "./SystemHealth";
import type { SystemDashboardData } from "@/features/base/dashboard/types";
import { UserGrowthChart } from "./UserGrowChart";

type Props = { data: SystemDashboardData };

export function SystemDashboard({ data }: Props) {
    const { user, stats, charts, system_health, recent_activity } = data;

    return (
        <>
            <WelcomeBanner user={user} />
            <SystemStatsGrid stats={stats} />
            {/* Row 1: Growth chart + Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <UserGrowthChart userGrowth={charts.user_growth} />
                <UserComposition composition={charts.composition} />
            </div>
            {/* Row 2: Activity + Quick Actions + System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RecentActivity activities={recent_activity} />
                <SystemHealth health={system_health} />
            </div>
        </>
    );
}