import React from "react";
import { NavLink } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <div className={`breadcrumbs text-sm ${className}`}>
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index}>
              {isLast ? (
                // Current page — always styled as active
                <span className="flex items-center gap-1 font-medium text-primary pointer-events-none">
                  {item.icon}
                  {item.label}
                </span>
              ) : item.href ? (
                // Parent with link
                <NavLink
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-1 transition-colors ${
                      isActive
                        ? "text-primary font-medium"
                        : "text-base-content/60 hover:text-primary"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ) : (
                // Parent with click handler (no href)
                <button
                  onClick={item.onClick}
                  className="flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;