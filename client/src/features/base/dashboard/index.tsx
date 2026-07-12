import { LoadingOverlay } from "@/components";
import { ScrollContainer } from "@/components/ScrollContainer";
import { PersonalDashboard } from "./components/personal/PersonalDashboard";
import { SystemDashboard } from "./components/system/SystemDashboard";
import { useDashboard } from "./hooks/useDashboard";

const Dashboard = () => {
    const { data, isPending } = useDashboard();
    const info = data?.data;
    if (isPending) return <LoadingOverlay />
    if (!info) return null;
    return (
        <ScrollContainer>
            {info.view_type === "system"
                ? <SystemDashboard data={info} />
                : <PersonalDashboard data={info} />
            }
        </ScrollContainer>
    );
};

export default Dashboard;