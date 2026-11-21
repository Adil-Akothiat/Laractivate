import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = "",
}) => {
  const trendColorMap = {
    up: "text-success",
    down: "text-error",
    neutral: "text-base-content/60",
  };

  const trendIconMap = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <div className={`stat bg-base-100 rounded-box shadow-sm border border-base-200 ${className}`}>
      <div className="stat-figure text-primary">
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
      <div className="stat-title text-base-content/60">{title}</div>
      <div className="stat-value">{value}</div>
      {(description || trend) && (
        <div className="stat-desc flex items-center gap-1 mt-1">
          {trend && (
            <span className={`font-medium ${trendColorMap[trend.direction]}`}>
              {trendIconMap[trend.direction]} {trend.value}
            </span>
          )}
          {description && (
            <span className="text-base-content/50">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
