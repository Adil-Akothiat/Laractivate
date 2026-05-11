import React from "react";
import { ScrollContainer } from "../ScrollContainer";

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: "default" | "boxed" | "lifted" | "bordered";
  size?: "xs" | "sm" | "md" | "lg";
  renderContent?: boolean;
  className?: string;
  vertical?: boolean;
  sidebarClassName?: string;
}

const variantMap = {
  default: "",
  boxed: "tabs-boxed",
  lifted: "tabs-lifted",
  bordered: "tabs-bordered",
};

const sizeMap = {
  xs: "tabs-xs",
  sm: "tabs-sm",
  md: "",
  lg: "tabs-lg",
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeKey,
  onChange,
  variant = "default",
  size = "md",
  renderContent = true,
  className = "",
  vertical = false,
  sidebarClassName = "",
}) => {
  const [internalActive, setInternalActive] = React.useState(
    activeKey ?? tabs[0]?.key
  );

  const currentKey = onChange ? (activeKey ?? internalActive) : internalActive;

  const handleChange = (key: string) => {
    setInternalActive(key);
    onChange?.(key);
  };

  const activeTab = tabs.find((t) => t.key === currentKey);

  return (
    <div className={vertical ? `flex gap-4 ${className}` : className}>
      <div
        role="tablist"
        className={`tabs ${variantMap[variant]} ${sizeMap[size]} ${
          vertical ? `flex-col h-fit ${sidebarClassName}` : ""
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            className={`tab gap-2 ${vertical ? "justify-start" : ""} ${
              tab.key === currentKey ? "tab-active" : ""
            } ${
              tab.disabled ? "tab-disabled opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !tab.disabled && handleChange(tab.key)}
            aria-selected={tab.key === currentKey}
            aria-disabled={tab.disabled}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="badge badge-sm">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {renderContent && activeTab?.content && (
        <div className={vertical ? "flex-1" : "mt-4"}>
          <ScrollContainer childrenClassName="mb-20">
            {activeTab.content}
          </ScrollContainer>
        </div>
      )}
    </div>
  );
};

export default Tabs;