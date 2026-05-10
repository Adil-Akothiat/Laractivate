import { useEffect, useState } from "react";
import { useProfile, useUpdateProfile } from "../../hooks";
import { getErrorsMessages } from "../../../../../app/utils";
import DangerZone from "./DangerZone";
import { ComponentLoader } from "../../../../../components/Loaders";
import SettingsContainer from "../Shared/SettingsContainer";
import ProfilForm from "./ProfilForm";
import { useToastContext } from "../../../../../app/hooks/useToastContext";

export default function Profile() {
  const { data: user, isLoading } = useProfile();
  const { toast } = useToastContext();
  const { mutate, isPending } = useUpdateProfile();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName,  setLastName]  = useState<string>("");

  useEffect(() => {
    if (user?.first_name) setFirstName(user.first_name);
    if (user?.last_name)  setLastName(user.last_name);
  }, [user]);

  
  // ── Profile form ──────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ first_name: firstName, last_name: lastName },
      {
        onSuccess:()=> {
          toast.success("Profile updated successfully.");
        },
        onError:(err:any)=> {
          const message = getErrorsMessages(err).join('|');
          toast.success(message);
        }
      }
    );
  };
  const form = {
    firstName,
    lastName,
    setFirstName,
    setLastName
  }
  
  if (isLoading) return <ComponentLoader isLoading={isLoading} />;

  return (
    <SettingsContainer settingsType="profile">
      <ProfilForm
        handleSubmit={handleSubmit}
        user={user}
        form={form}
        isPending={isPending}
      />
      <div className="mt-10">
        <DangerZone roles={user?.rolesSet} />
      </div>
    </SettingsContainer>
  );
}