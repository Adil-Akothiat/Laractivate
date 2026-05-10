import { useUpdateAvatarProfile } from "../../hooks";
import type { User } from "../../types";
import AvatarUploader from "../../../../../components/AvatarUploader"; // adjust path

export default function ProfileAvatar({ user }: { user: User }) {
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