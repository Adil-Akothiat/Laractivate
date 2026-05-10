// components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  total:        number;
  perPage:      number;
  onPageChange: (page: number) => void;
  size?:        "xs" | "sm" | "md";
  className?:   string;
}

function generatePages(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
  size = "sm",
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const from  = (currentPage - 1) * perPage + 1;
  const to    = Math.min(currentPage * perPage, total);
  const pages = generatePages(currentPage, totalPages);
  const btn   = `join-item btn btn-${size}`;

  return (
    <div className={`flex items-center justify-between mt-3 ${className}`}>
      <span className="text-sm text-base-content/50">
        {from}–{to} of {total}
      </span>

      <div className="join">
        <button
          className={btn}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >‹</button>

        {pages.map((page, i) =>
          page === "..." ? (
            <button key={`e-${i}`} className={`${btn} btn-disabled pointer-events-none`}>…</button>
          ) : (
            <button
              key={page}
              className={`${btn} ${page === currentPage ? "btn-active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className={btn}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >›</button>
      </div>
    </div>
  );
};

export default Pagination;