import React from "react";

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
  className?: string;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  hover?: boolean;
  className?: string;
  menuClassName?: string;
}

const positionMap = {
  "bottom-start": "dropdown-bottom",
  "bottom-end": "dropdown-bottom dropdown-end",
  "top-start": "dropdown-top",
  "top-end": "dropdown-top dropdown-end",
};

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = "bottom-end",
  hover = false,
  className = "",
  menuClassName = "",
}) => {
  return (
    <div
      className={`dropdown ${positionMap[position]} ${hover ? "dropdown-hover" : ""} ${className}`}
    >
      <div tabIndex={0} role="button">
        {trigger}
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-200 z-50 min-w-48 p-1 mt-1 ${menuClassName}`}
      >
        {items.map((item) =>
          item.divider ? (
            <li key={item.key}>
              <hr className="my-1 border-base-200" />
            </li>
          ) : (
            <li key={item.key}>
              <button
                className={`flex items-center gap-2 w-full text-left ${
                  item.disabled ? "disabled opacity-50 cursor-not-allowed" : ""
                } ${item.className ?? ""}`}
                onClick={item.disabled ? undefined : item.onClick}
                disabled={item.disabled}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
