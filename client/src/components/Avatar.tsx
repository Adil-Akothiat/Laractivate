import React from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: "circle" | "square";
  online?: boolean;
  offline?: boolean;
  placeholder?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: "w-6",
  sm: "w-8",
  md: "w-12",
  lg: "w-16",
  xl: "w-24",
};

const fontSizeMap: Record<AvatarSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  initials,
  size = "md",
  shape = "circle",
  online,
  offline,
  placeholder = false,
  className = "",
}) => {
  const statusClass = online
    ? "avatar-online"
    : offline
    ? "avatar-offline"
    : "";

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div
      title={!src && initials ? initials : undefined}
      className={`avatar ${placeholder || !src ? "placeholder" : ""} ${statusClass} ${className}`}
    >
      <div
        className={`${sizeMap[size]} ${shapeClass} ${
          !src
            ? "bg-primary/10 text-primary flex items-center justify-center"
            : ""
        }`}
      >
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <span
            className={`leading-none font-bold select-none ${fontSizeMap[size]}`}
          >
            {initials?.[0]?.toUpperCase() ?? "?"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Avatar;