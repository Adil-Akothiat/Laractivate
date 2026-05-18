import { useEffect, useState } from "react";
import { Button, Input } from "@/components";
import AvatarUploader from "./ProfileAvatar";
import type { UserSchema } from "@/features/base/shared";
import { useSettingsMutations } from "../../hooks";
// import { getErrorsMessages } from "@/app/utils";
// import { useToastContext } from "@/app/hooks/common";

type Props = {
  user: UserSchema;
};

export default function ProfilForm({ user }: Props) {
  const [form, setForm] = useState({
    firstName:user.first_name,
    lastName:user.last_name,
    email:user.email
  });
  const { updateProfile } = useSettingsMutations();

  useEffect(() => {
    if (user?.first_name) setForm(prev=> ({...prev, firstName:user.first_name}));
    if (user?.last_name) setForm(prev=> ({...prev, lastName:user.last_name}));
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      { first_name: form.firstName, last_name: form.lastName }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUploader user={user} />
      {/* ── Name fields ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-4">
        <Input
          id="user_first_name"
          label="First name"
          type="text"
          value={form.firstName}
          onChange={(e) => setForm(prev=> ({...prev, firstName: e.target.value}))}
          disabled={updateProfile.isPending}
          required
        />
        <Input
          id="user_last_name"
          label="Last name"
          type="text"
          value={form.lastName}
          onChange={(e) => setForm(prev=> ({...prev, lastName: e.target.value}))}
          disabled={updateProfile.isPending}
          required
        />
      </div>
      {/* ── Email (read-only) ─────────────────────────────────────────── */}
      <Input
        id="user_email"
        label="Email"
        type="email"
        value={form?.email ? form.email : user?.email}
        readOnly={form?.email ? false : true}
        // onChange={}
        className="bg-base-200 cursor-not-allowed"
        helperText={form?.email ? "Email cannot be changed." : undefined}
      />

      <Button
        variant="primary"
        type="submit"
        loading={updateProfile.isPending}
      >
        Save Changes
      </Button>
    </form>
  );
}