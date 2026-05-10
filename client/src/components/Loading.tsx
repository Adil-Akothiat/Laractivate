import React from "react";

// ─── Spinner ──────────────────────────────────────────────────────────────────

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const spinnerSizeMap: Record<SpinnerSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "spinner",
  className = "",
}) => (
  <span
    className={`loading loading-${variant} ${spinnerSizeMap[size]} ${className}`}
  />
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "w-full",
  height = "h-4",
  className = "",
  rounded = true,
  circle = false,
}) => (
  <div
    className={`skeleton ${width} ${height} ${circle ? "rounded-full" : rounded ? "rounded" : ""} ${className}`}
  />
);

// ─── Skeleton Card preset ─────────────────────────────────────────────────────

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`card bg-base-100 border border-base-200 shadow-sm p-4 space-y-4 ${className}`}
  >
    <Skeleton height="h-40" rounded />
    <Skeleton width="w-3/4" height="h-4" />
    <Skeleton width="w-1/2" height="h-3" />
    <div className="flex gap-2">
      <Skeleton width="w-20" height="h-8" />
      <Skeleton width="w-20" height="h-8" />
    </div>
  </div>
);

// ─── Skeleton Table preset ────────────────────────────────────────────────────

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <Skeleton height="h-4" width="w-24" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}>
                <Skeleton height="h-4" width={c === 0 ? "w-32" : "w-20"} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Full-page loading overlay ────────────────────────────────────────────────

export const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => (
  <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
    <Spinner size="lg" />
    {message && (
      <p className="text-base-content/60 text-sm">{message}</p>
    )}
  </div>
);
