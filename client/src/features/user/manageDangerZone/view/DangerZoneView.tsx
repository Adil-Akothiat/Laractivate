import { SettingsContainer } from "@/pages/user";
import DeactivateUser from "../ui/DeactivateUser";

export function DangerZoneView() {
    return (
        <SettingsContainer settingsType="danger_zone">
            <DeactivateUser />
        </SettingsContainer>
    );
}