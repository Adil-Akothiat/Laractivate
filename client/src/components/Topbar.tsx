import React from "react";

interface TopbarProps {
  title?: string;
  logo?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onMenuToggle?: () => void;
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  title,
  logo,
  leftSlot,
  rightSlot,
  onMenuToggle,
  className = "",
}) => {
  return (
    <header
      className={`navbar bg-base-100 border-b border-base-200 px-4 min-h-16 ${className}`}
    >
      {/* Left section */}
      <div className="navbar-start gap-2">
        {onMenuToggle && (
          <button
            className="btn btn-ghost btn-square"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        {logo && <div className="flex items-center">{logo}</div>}
        {title && (
          <span className="text-lg font-semibold truncate">{title}</span>
        )}
        {leftSlot}
      </div>

      {/* Right section */}
      {rightSlot && (
        <div className="navbar-end gap-2">{rightSlot}</div>
      )}
    </header>
  );
};

export default Topbar;
