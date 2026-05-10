interface GlobalPageLoaderProps {
  isLoading: boolean;
  message?: string;
}

/**
 * GlobalPageLoader
 * - Covers the ENTIRE screen (including content behind it)
 * - Use this when navigating to a new page while data is being fetched
 * - Content underneath is fully hidden until loading completes
 */
export const GlobalPageLoader = ({ isLoading, message = 'Loading page...' }: GlobalPageLoaderProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-base-100 flex flex-col items-center justify-center gap-6">
      {/* Brand / logo area */}
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-ring loading-lg text-primary w-16 h-16"></span>
        <p className="text-base-content/60 text-sm tracking-widest uppercase animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

interface ComponentLoaderProps {
  isLoading: boolean;
  message?: string;
  /** 'overlay' wraps a relative parent; 'inline' takes up space in the flow */
  variant?: 'overlay' | 'inline';
  /** Minimum height for inline variant */
  minHeight?: string;
  children?: React.ReactNode;
}

/**
 * ComponentLoader
 * - Use inside a specific card, section, or widget
 * - 'overlay' mode: position your parent as `relative`, this will overlay it
 * - 'inline' mode: replaces content area with a centered spinner
 */
export const ComponentLoader = ({
  isLoading,
  message,
  variant = 'inline',
  minHeight = '200px',
  children,
}: ComponentLoaderProps) => {
  // ── Overlay mode ──────────────────────────────────────────────
  if (variant === 'overlay') {
    return (
      <>
        {children}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-base-100/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-[inherit]">
            <span className="loading loading-spinner loading-md text-primary"></span>
            {message && <p className="text-base-content/70 text-xs">{message}</p>}
          </div>
        )}
      </>
    );
  }

  // ── Inline mode ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center gap-3"
        style={{ minHeight }}
      >
        <span className="loading loading-dots loading-md text-primary"></span>
        {message && <p className="text-base-content/50 text-xs">{message}</p>}
      </div>
    );
  }

  return <>{children}</>;
};

interface SkeletonLoaderProps {
  /** Layout preset */
  variant?: 'card' | 'list' | 'table-row' | 'text';
  /** Number of repeated skeleton items */
  count?: number;
  trCount?: number;
  tdCount?: number;
}

const SkeletonCard = () => (
  <div className="card bg-base-200 shadow-sm p-4 flex flex-col gap-3">
    <div className="skeleton h-40 w-full rounded-lg"></div>
    <div className="skeleton h-4 w-3/4 rounded"></div>
    <div className="skeleton h-3 w-1/2 rounded"></div>
    <div className="flex gap-2 mt-1">
      <div className="skeleton h-3 w-16 rounded"></div>
      <div className="skeleton h-3 w-16 rounded"></div>
    </div>
  </div>
);

const SkeletonListItem = () => (
  <div className="flex items-center gap-4 p-3 border-b border-base-200">
    <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
    <div className="flex-1 flex flex-col gap-2">
      <div className="skeleton h-3 w-1/3 rounded"></div>
      <div className="skeleton h-3 w-2/3 rounded"></div>
    </div>
    <div className="skeleton h-6 w-16 rounded-full"></div>
  </div>
);

const SkeletonTableRow = ({ tdCount=1 }:{ tdCount?:number }) => (
  <tr>
    {[...Array(tdCount)].map((_, i) => (
      <td key={i} className="p-3">
        <div className="skeleton h-4 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

const SkeletonText = () => (
  <div className="flex flex-col gap-2">
    <div className="skeleton h-4 w-full rounded"></div>
    <div className="skeleton h-4 w-5/6 rounded"></div>
    <div className="skeleton h-4 w-4/6 rounded"></div>
  </div>
);

/**
 * SkeletonLoader
 * - Use when you want to show a placeholder that matches the shape of incoming content
 * - Reduces layout shift and feels more polished than a spinner
 */
export const SkeletonLoader = ({ variant = 'card', count = 3, trCount=1, tdCount=1 }: SkeletonLoaderProps) => {
  const items = [...Array(count)];

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-base-100 rounded-box border border-base-200 overflow-hidden">
        {items.map((_, i) => <SkeletonListItem key={i} />)}
      </div>
    );
  }

  if (variant === 'table-row') {
    const tableItems = [...Array(trCount)];
    return (
      <>
        {tableItems.map((_, i) => <SkeletonTableRow tdCount={tdCount} key={i}  />)}
      </>
    );
  }

  // text
  return (
    <div className="flex flex-col gap-4">
      {items.map((_, i) => <SkeletonText key={i} />)}
    </div>
  );
};