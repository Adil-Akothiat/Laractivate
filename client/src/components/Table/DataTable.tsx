import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./index";
import { SkeletonLoader } from "../Loaders";
import { Can } from "../Guard/Can";
import { EllipsisVertical } from "lucide-react";
import Button from "../Button";
import { Link } from "react-router-dom";

export interface Action<T> {
  label:       string;
  className?:  string;
  /**
   * Gates this action behind a <Can> permission check.
   * Omit entirely for public actions (no gate rendered).
   */
  permission?: string;
  /**
   * Hide this action for specific rows.
   * Return true to hide, false/undefined to show.
   */
  hidden?:     (row: T) => boolean;
  /**
   * Navigate to a page instead of calling onClick.
   * Accepts a static string or a function that receives the row.
   *
   * @example
   * href="/users/create"
   * href={(row) => `/users/${row.id}/edit`}
   */
  href?:       string | ((row: T) => string);
  /**
   * In-page action handler.
   * Only used when href is not set.
   */
  onClick?:    (row: T) => void;
}

export interface Column<T> {
  key:              keyof T | string;
  header:           string;
  render?:          (row: T, index: number) => React.ReactNode;
  className?:       string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns:        Column<T>[];
  data:           T[];
  keyExtractor:   (row: T, index: number) => string | number;
  loading?:       boolean;
  emptyMessage?:  string;
  zebra?:         boolean;
  pinRows?:       boolean;
  pinCols?:       boolean;
  compact?:       boolean;
  className?:     string;
  onRowClick?:    (row: T) => void;
  /**
   * Number of skeleton rows while loading.
   * Falls back to a centered spinner when omitted.
   */
  skeletonRows?:  number;
  /**
   * Row-level actions rendered as a ⋮ dropdown in the last column.
   * Supports navigation (href), in-page handlers (onClick),
   * and optional permission gating (permission).
   */
  actions?:       Action<T>[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionsDropdown
// ─────────────────────────────────────────────────────────────────────────────

interface ActionsDropdownProps<T> {
  row:     T;
  actions: Action<T>[];
  isLast: boolean;
}
function ActionsDropdown<T>({ row, actions, isLast }: ActionsDropdownProps<T>) {
  const [open, setOpen]   = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const ref        = useRef<HTMLDivElement>(null);
  const buttonRef  = useRef<HTMLButtonElement|null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (buttonRef.current) {
      const rect       = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setFlipUp(spaceBelow < 160); // flip up if less than 160px below
    }

    setOpen((v) => !v);
  };

  const visible = actions.filter((a) => !a.hidden?.(row));
  if (visible.length === 0) return null;

  const close = () => setOpen(false);
  
  const renderItem = (action: Action<T>, i: number, disabled: boolean) => {
    if (action.href) {
      const href =
        typeof action.href === "function" ? action.href(row) : action.href;
      return (
        <li key={i} role="none" className={disabled ? "blocked-element" : ""}>
          <Link
            role="menuitem"
            to={href}
            className={action.className}
            onClick={close}
          >
            {action.label}
          </Link>
        </li>
      );
    }

    return (
      <li key={i} role="none" className={disabled ? "blocked-element" : ""}>
        <button
          role="menuitem"
          className={action.className}
          onClick={(e) => {
            e.stopPropagation();
            close();
            action.onClick?.(row);
          }}
        >
          {action.label}
        </button>
      </li>
    );
  };

  return (
    <div
      ref={ref}
      className={`relative inline-block dropdown ${isLast ? "dropdown-top dropdown-left" : "dropdown-bottom dropdown-left"} ${flipUp ? "dropdown-top" : ""}`}
    >
      <Button
        ref={buttonRef}
        variant="ghost"
        size="xs"
        square={true}
        onClick={handleOpen}
      >
        <EllipsisVertical size={16} />
      </Button>

      {open && (
        <ul
          role="menu"
          className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-lg z-50 min-w-max p-1 border border-base-200"
        >
          {visible.map((action, i) =>
            action.permission ? (
              <Can 
                key={i} 
                permission={action.permission}
                fallback={renderItem(action, i, true)}
              >
                {renderItem(action, i, false)}
              </Can>
            ) : (
              renderItem(action, i, false)
            )
          )}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────────────────────

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading       = false,
  emptyMessage  = "No data available.",
  zebra,
  pinRows,
  pinCols,
  compact,
  className,
  onRowClick,
  skeletonRows,
  actions,
}: DataTableProps<T>) {
  const hasActions = !!actions?.length;
  const totalCols  = columns.length + (hasActions ? 1 : 0);

  const renderLoading = () =>
    skeletonRows ? (
      <SkeletonLoader
        variant="table-row"
        trCount={skeletonRows}
        tdCount={totalCols}
      />
    ) : (
      <TableRow>
        <TableCell colSpan={totalCols} className="text-center py-10">
          <span className="loading loading-spinner loading-md" />
        </TableCell>
      </TableRow>
    );

  return (
    <Table
      zebra={zebra}
      pinRows={pinRows}
      pinCols={pinCols}
      compact={compact}
      className={className}
    >
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.key)} className={col.headerClassName}>
              {col.header}
            </TableHead>
          ))}
          {hasActions && (
            <TableHead className="w-10" aria-label="Actions" />
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          renderLoading()
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={totalCols}
              className="text-center py-10 text-base-content/50"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={keyExtractor(row, index)}
              clickable={!!onRowClick}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <TableCell key={String(col.key)} className={col.className}>
                  {col.render
                    ? col.render(row, index)
                    : String(
                        (row as Record<string, unknown>)[String(col.key)] ?? ""
                      )}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionsDropdown 
                    isLast={data.length - 1 === index}
                    row={row}
                    actions={actions!}
                  />
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;