import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Table
// Wraps the native <table> in an overflow-safe scroll container.
//
// Usage:
//   <Table zebra pinRows pinCols compact className="...">
// ─────────────────────────────────────────────────────────────────────────────

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  zebra?:   boolean;
  pinRows?: boolean;
  pinCols?: boolean;
  compact?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ zebra, pinRows, pinCols, compact, className, ...props }, ref) => {
    const classes = [
      "table w-full",
      zebra   ? "table-zebra"    : "",
      pinRows ? "table-pin-rows" : "",
      pinCols ? "table-pin-cols" : "",
      compact ? "table-xs"       : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="overflow-x-auto w-full max-h-[calc(100vh-300px)]">
        <table ref={ref} className={classes} {...props} />
      </div>
    );
  }
);
Table.displayName = "Table";

// ─────────────────────────────────────────────────────────────────────────────
// TableHeader  →  <thead>
// ─────────────────────────────────────────────────────────────────────────────

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = "TableHeader";

// ─────────────────────────────────────────────────────────────────────────────
// TableBody  →  <tbody>
// ─────────────────────────────────────────────────────────────────────────────

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
));
TableBody.displayName = "TableBody";

// ─────────────────────────────────────────────────────────────────────────────
// TableFooter  →  <tfoot>
// ─────────────────────────────────────────────────────────────────────────────

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`border-t border-base-200 bg-base-200/40 font-medium ${className ?? ""}`}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// ─────────────────────────────────────────────────────────────────────────────
// TableRow  →  <tr>
//
// clickable  adds hover + pointer cursor (use when onRowClick is set)
// ─────────────────────────────────────────────────────────────────────────────

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ clickable, className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`hover ${clickable ? "cursor-pointer" : ""} ${className ?? ""}`}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

// ─────────────────────────────────────────────────────────────────────────────
// TableHead  →  <th>
// ─────────────────────────────────────────────────────────────────────────────

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={className} {...props} />
));
TableHead.displayName = "TableHead";

// ─────────────────────────────────────────────────────────────────────────────
// TableCell  →  <td>
// ─────────────────────────────────────────────────────────────────────────────

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={className} {...props} />
));
TableCell.displayName = "TableCell";

// ─────────────────────────────────────────────────────────────────────────────
// TableCaption  →  <caption>
// ─────────────────────────────────────────────────────────────────────────────

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={`mt-2 text-xs text-base-content/40 text-left ${className ?? ""}`}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};