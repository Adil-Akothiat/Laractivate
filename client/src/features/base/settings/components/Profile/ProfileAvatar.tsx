import AvatarUploader from '@/components/FileUploader/AvatarUploader';
import { useSettingsMutations } from '../../hooks';
import type { UserSchema } from '@/features/base/shared';

export default function ProfileAvatar({ user }: { user: UserSchema }) {
    const { updateAvatar } = useSettingsMutations();

    return (
        <AvatarUploader
            avatarUrl={user?.avatar}
            firstName={user?.first_name}
            lastName={user?.last_name}
            isUploading={updateAvatar.isPending}
            isError={updateAvatar.isError}
            error={updateAvatar.error}
            onUpload={(formData) => updateAvatar.mutate(formData)}
        />
    );
}
