import { Button, Input } from "@/components";
import AvatarUploader from "@/components/FileUploader/AvatarUploader";
import type { UserSchema } from "@/features/shared";
import { useUpdateUserProfile } from "../model";

export default function ProfilForm({ user }: { user: UserSchema }) {
  const { handleSubmit, uploadAvatar, updateProfile, form, setForm } = useUpdateUserProfile(user);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUploader
        avatarUrl={user?.avatar}
        firstName={user?.first_name}
        lastName={user?.last_name}
        isUploading={uploadAvatar.isPending}
        isError={uploadAvatar.isError}
        error={uploadAvatar.error}
        onUpload={(formData: FormData) => uploadAvatar.mutate(formData)}
      />
      {/* ── Name fields ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-4">
        <Input
          id="user_first_name"
          label="First name"
          type="text"
          value={form.first_name}
          onChange={(e) => setForm(prev => ({ ...prev, first_name: e.target.value }))}
          disabled={updateProfile.isPending}
          required
        />
        <Input
          id="user_last_name"
          label="Last name"
          type="text"
          value={form.last_name}
          onChange={(e) => setForm(prev => ({ ...prev, last_name: e.target.value }))}
          disabled={updateProfile.isPending}
          required
        />
      </div>
      {/* ── Email (read-only) ─────────────────────────────────────────── */}
      <Input
        id="user_email"
        label="Email"
        type="email"
        value={user?.email ?? ""}
        readOnly
        className="bg-base-200 cursor-not-allowed"
        helperText={user?.email ? "Email cannot be changed." : undefined}
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