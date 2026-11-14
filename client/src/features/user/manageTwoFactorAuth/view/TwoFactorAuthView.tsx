import { DataLoader } from "@/components/Loaders/DataLoader";
import { useGetUser } from "@/entities/user";
import { SettingsContainer } from "@/pages/user";
import { TfaStepperContextProvider } from "../model/TfaStepperContext";
import { VerifyAndEnableTfaContextProvider } from "../model/TfaVerificationAndEnableContext";
import { TfaRecoveryContextProvider } from "../model/useTfaRecoveryContext";
import TwoFactorStepper from "../ui/TwoFactorStepper";

export function TwoFactorAuthView() {
  const query = useGetUser();
  return (
    <DataLoader query={query}>
      {(user) => {
        return (
          <SettingsContainer
            settingsType="two_factor_auth"
          >
            <TfaRecoveryContextProvider>
              <TfaStepperContextProvider>
                <VerifyAndEnableTfaContextProvider>
                  <TwoFactorStepper user={user} />
                </VerifyAndEnableTfaContextProvider>
              </TfaStepperContextProvider>
            </TfaRecoveryContextProvider>
          </SettingsContainer>
        );
      }}
    </DataLoader>
  );
}