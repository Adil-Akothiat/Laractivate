import { DataLoader } from "@/components/ui/feedback/DataLoader";
import { useGetUser } from "@/entities/user";
import { SettingsContainer } from "@/pages/user";
import ProfilForm from "../ui/ProfilForm";

export default function ProfileView() {
    const query = useGetUser();
    return (
        <DataLoader query={query}>
            {(data) => {
                return (
                    <SettingsContainer settingsType="profile">
                        <ProfilForm user={data} />
                    </SettingsContainer>
                );
            }}
        </DataLoader>
    );
}