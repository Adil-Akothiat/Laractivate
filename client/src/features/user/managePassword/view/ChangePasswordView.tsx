import { SettingsContainer } from "@/pages/user";
import ChangeUserPassword from "../ui/ChangeUserPassword";

export function ChangePasswordView() {
    return (
        <SettingsContainer settingsType="password">
            <ChangeUserPassword />
        </SettingsContainer>
    );
}