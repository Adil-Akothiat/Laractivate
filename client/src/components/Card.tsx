import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  bordered?: boolean;
  compact?: boolean;
  side?: boolean;
  imageFull?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  image,
  imageAlt = "",
  actions,
  children,
  className = "",
  bodyClassName = "",
  bordered = true,
  compact = false,
  side = false,
  imageFull = false,
}) => {
  const cardClasses = [
    "card",
    "bg-base-100",
    bordered ? "shadow-sm border border-base-200" : "shadow-md",
    compact ? "card-compact" : "",
    side ? "card-side" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {image && !imageFull && (
        <figure>
          <img src={image} alt={imageAlt} className="w-full object-cover" />
        </figure>
      )}
      {image && imageFull && (
        <figure className="relative">
          <img src={image} alt={imageAlt} className="w-full object-cover" />
        </figure>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {(title || subtitle) && (
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && (
              <p className="text-base-content/60 text-sm mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
        {children}
        {actions && <div className="card-actions justify-end mt-2">{actions}</div>}
      </div>
    </div>
  );
};

export default Card;
