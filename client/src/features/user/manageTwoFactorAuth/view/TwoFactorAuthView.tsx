import { SettingsContainer } from "@/pages/user";
import { TfaContextProvider } from "../model";
import TwoFactorStepper from "../ui/TwoFactorStepper";

export function TwoFactorAuthView() {
  // const query = useGetUser();
  return (
    <SettingsContainer
      settingsType="two_factor_auth"
    >
      <TfaContextProvider>
        <TwoFactorStepper />
      </TfaContextProvider>
    </SettingsContainer>
  );
}