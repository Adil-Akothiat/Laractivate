import AvatarUploader from "@/components/FileUploader/AvatarUploader";
import { useUpdateAvatarProfile } from "@/features/base/settings";
import type { UserProps } from "@/features/base/shared";

export default function ProfileAvatar({ user }: { user: UserProps }) {
    const {
        mutate: uploadAvatar,
        isPending: isUploading,
        isError,
        error,
    } = useUpdateAvatarProfile();

    return (
        <AvatarUploader
            avatarUrl={user?.avatar}
            firstName={user?.first_name}
            lastName={user?.last_name}
            isUploading={isUploading}
            isError={isError}
            error={error}
            onUpload={(formData) =>
                uploadAvatar(formData, {
                    onError: () => {
                        // revert is handled inside AvatarUploader via isError
                    },
                })
            }
        />
    );
}