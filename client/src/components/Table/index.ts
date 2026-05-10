// Primitives — use when you need full structural control
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./Table";

// Smart component — use for data-driven tables with loading/empty/actions
export { default as DataTable } from "./DataTable";
export type { Column, Action, DataTableProps } from "./DataTable";