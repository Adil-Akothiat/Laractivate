import type { SubmitEvent } from "react";
import { Button, Input } from "@/components";
import AvatarUploader from "./ProfileAvatar";
import type { UserSchema } from "@/features/base/shared";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type Props = {
    handleSubmit:(e:SubmitEvent<HTMLFormElement>)=> void;
    user:UserSchema;
    form:{
        firstName:string;
        lastName:string;
        email?:string;
        setFirstName:SetState<string>;
        setLastName:SetState<string>;
        setEmail?:SetState<string>;
    };
    isPending:boolean;
}
export default function ProfilForm({ handleSubmit, user, form, isPending }:Props) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <AvatarUploader
          user={user}
        />
        {/* ── Name fields ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            id="user_first_name"
            label="First name"
            type="text"
            value={form.firstName}
            onChange={(e)=> form.setFirstName(e.target.value)}
            disabled={isPending}
            required
          />
          <Input
            id="user_last_name"
            label="Last name"
            type="text"
            value={form.lastName}
            onChange={(e) => form.setLastName(e.target.value)}
            disabled={isPending}
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
          onChange={(e)=> form?.setEmail ? form.setEmail(e.target.value) : null}
          className="bg-base-200 cursor-not-allowed"
          helperText={form?.email ? "Email cannot be changed." : undefined}
        />

        <Button variant="primary" type="submit" disabled={isPending} loading={isPending}>
          Save Changes
        </Button>
      </form>
    );
}