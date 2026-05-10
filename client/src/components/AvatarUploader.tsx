import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { imageRender } from "../app/utils/imagePreviewHandler";
import { getErrorsMessages } from "../app/utils";
import { Alert } from "./Alert";

interface Props {
    avatarUrl?:  string | null;
    firstName?:  string;
    lastName?:   string;
    isUploading?: boolean;
    error?:      unknown;
    isError?:    boolean;
    onUpload:    (formData: FormData) => void;
    compact?:     boolean;
}

export default function AvatarUploader({
    avatarUrl,
    firstName,
    lastName,
    isUploading = false,
    error,
    isError     = false,
    onUpload,
    compact = false,
}: Props) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        imageRender(avatarUrl) 
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAvatarPreview(imageRender(avatarUrl));
    }, [avatarUrl]);

    const initials = [firstName, lastName]
        .filter(Boolean)
        .map((n) => n![0].toUpperCase())
        .join("");

    const handleAvatarClick = () => {
        if (!isUploading) fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);

        const formData = new FormData();
        formData.append("avatar", file);

        onUpload(formData);

        e.target.value = "";
    };

    return (
        <div>
            {isError && getErrorsMessages(error).map((msg, i) => (
                <Alert key={i} variant="error" message={msg} />
            ))}

            <div className="flex items-center gap-5">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                />

                <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                    className="relative w-20 h-20 rounded-full shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Upload avatar"
                >
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center">
                            {initials || "?"}
                        </div>
                    )}

                    <div className={`absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 transition-opacity bg-black/50 text-white
                        ${isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                        {isUploading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <>
                                <Camera size={18} />
                                <span className="text-[10px] font-medium leading-none">Upload</span>
                            </>
                        )}
                    </div>
                </button>
                 {!compact && (
                    <div>
                        <p className="text-sm font-medium text-base-content">Profile photo</p>
                        <p className="text-xs text-base-content/50 mt-0.5">JPG, PNG, WEBP or GIF · Max 2 MB</p>
                    </div>
                )}
            </div>
        </div>
    );
}