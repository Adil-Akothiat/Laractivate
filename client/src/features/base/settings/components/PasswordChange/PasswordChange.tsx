import { useState } from "react";
import { EyeOff } from "lucide-react";
import { useChangePassword } from "@/features/base/settings";
import { getErrorsMessages } from "@/app/utils";
import { Button, Input } from "@/components";
import SettingsContainer from "../Shared/SettingsContainer";
import { useToastContext } from "@/app/hooks/common";

export default function ChangePassword() {
  const { mutate, isPending, reset } = useChangePassword();
  const { toast } = useToastContext();
  const [currentPassword,      setCurrentPassword]      = useState("");
  const [password,             setPassword]             = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        current_password:      currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      },
      { 
        onSuccess:()=> {
          toast.success('Password changed successfully! Please login again!');
          reset();
        },
        onError:(err:any)=> {
          const message = getErrorsMessages(err).join('|');
          toast.error(message);
        }
      }
    );
  };

  return (
    <SettingsContainer settingsType="password">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="password"
          label="Current Password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isPending}
          rightIcon={<EyeOff size={15} />}
          required
        />
        <div className="grid md:grid-cols-2 gap-y-2 gap-x-6">
          <Input
          type="password"
          label="New Password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          rightIcon={<EyeOff size={15} />}
          required
        />
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          disabled={isPending}
          rightIcon={<EyeOff size={15} />}
          required
        />
        </div>
          <Button 
            type="submit" 
            variant="primary" 
            loading={isPending}
            loadingText="Changing..."
          >
            Change
          </Button>
      </form>
    </SettingsContainer>
  );
}