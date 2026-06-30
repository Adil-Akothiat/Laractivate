import DangerZone from "./DangerZone";
import SettingsContainer from "../Shared/SettingsContainer";
import ProfilForm from "./ProfilForm";
import { useProfile } from "../../hooks";
import { DataLoader } from "@/components/Loaders/DataLoader";

export default function Profile() {
  const query = useProfile();
  return (
    <DataLoader query={query}>
      {(data) => {
        return(
          <SettingsContainer settingsType="profile">
            <ProfilForm user={data} />
            <div className="mt-10">
              <DangerZone roles={data.rolesSet} />
            </div>
          </SettingsContainer>
        );
      }}
    </DataLoader>
  );
}