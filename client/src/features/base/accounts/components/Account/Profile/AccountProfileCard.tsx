import { Mail, CheckCircle, XCircle, Edit } from "lucide-react";
import { Badge, Button, Card } from "@/components";
import { useParams } from "react-router-dom";
import { useAccountMutations } from "@/features/base/accounts";
import AvatarUploader from "@/components/FileUploader/AvatarUploader";
import type { UserSchema } from "@/features/base/shared";

type Props = {
    user:    UserSchema;
    onEdit:  () => void;
};

export default function AccountProfileCard({ user, onEdit }: Props) {
    const { id } = useParams<{ id: string }>();
    const { updateAvatar } = useAccountMutations();

    const uploadAvatarHandler = (formData: FormData) => {
        updateAvatar.mutate(
            { id: id!, data: formData }
        );
    };

    return (
    <Card>
        <div className="flex justify-between gap-4">
            <div className="flex items-center gap-4">
                <AvatarUploader
                    avatarUrl={user?.avatar}
                    firstName={user?.first_name}
                    lastName={user?.last_name}
                    isUploading={updateAvatar.isPending}
                    compact
                    onUpload={uploadAvatarHandler}
                />
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold">{user.full_name}</h2>
                        {user?.owner && (
                            <Badge variant="warning" size="sm">Owner</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-base-content/50 mt-0.5">
                        <Mail size={13} />
                        {user.email}
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {user.rolesSet.map((role: string, index: number) => (
                            <Badge key={index} variant="default" size="sm" outline>
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
            {/* Right — status + edit */}
            <div className="flex gap-3 shrink-0">
                <div className={`flex gap-1.5 text-sm font-medium ${
                    user.is_active ? "text-success" : "text-base-content/40"
                }`}>
                    {user.is_active
                        ? <><CheckCircle size={15} /> Active</>
                        : <><XCircle size={15} /> Inactive</>
                    }
                </div>
                <Button variant="ghost" size="sm" square onClick={onEdit}>
                    <Edit size={15} />
                </Button>
            </div>
        </div>
    </Card>
);
}