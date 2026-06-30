import { FingerprintPattern } from "lucide-react";
import { useProfile } from "../../hooks";
import TwoFactorStepper from "./TwoFactorStepper";
import { DataLoader } from "@/components/Loaders/DataLoader";
import SettingsContainer from "../Shared/SettingsContainer";

export default function TwoFactorAuth() {
  const query = useProfile();
  return (
    <DataLoader query={query}>
      {(data) => {
        return (
          <SettingsContainer
            settingsType="two_factor_auth"
          >
            <TwoFactorStepper user={data} />
          </SettingsContainer>
        );
      }}
    </DataLoader>
  );
}