import React from "react";

export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  onClick?: () => void;
}

interface SidebarProps {
  navItems: NavItem[];
  activeKey?: string;
  onNavClick?: (item: NavItem) => void;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  className?: string;
}

const NavItemRow: React.FC<{
  item: NavItem;
  activeKey?: string;
  onNavClick?: (item: NavItem) => void;
  collapsed?: boolean;
  depth?: number;
}> = ({ item, activeKey, onNavClick, collapsed = false, depth = 0 }) => {
  const isActive = activeKey === item.key;
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      onNavClick?.(item);
      item.onClick?.();
    }
  };

  const rowClasses = [
    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150 select-none",
    depth > 0 ? "ml-4 text-sm" : "font-medium",
    isActive
      ? "bg-primary text-primary-content"
      : "hover:bg-base-200 text-base-content",
  ].join(" ");

  return (
    <li>
      <div className={rowClasses} onClick={handleClick}>
        {item.icon && (
          <span className="shrink-0 text-lg">{item.icon}</span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span className="badge badge-sm badge-primary">{item.badge}</span>
            )}
            {hasChildren && (
              <span
                className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
              >
                ▶
              </span>
            )}
          </>
        )}
      </div>
      {hasChildren && open && !collapsed && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemRow
              key={child.key}
              item={child}
              activeKey={activeKey}
              onNavClick={onNavClick}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeKey,
  onNavClick,
  logo,
  footer,
  collapsed = false,
  className = "",
}) => {
  return (
    <aside
      className={`flex flex-col h-full bg-base-100 border-r border-base-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } ${className}`}
    >
      {logo && (
        <div className="flex items-center justify-center h-16 border-b border-base-200 px-4 shrink-0">
          {logo}
        </div>
      )}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItemRow
              key={item.key}
              item={item}
              activeKey={activeKey}
              onNavClick={onNavClick}
              collapsed={collapsed}
            />
          ))}
        </ul>
      </nav>
      {footer && (
        <div className="border-t border-base-200 p-3 shrink-0">{footer}</div>
      )}
    </aside>
  );
};

export default Sidebar;
