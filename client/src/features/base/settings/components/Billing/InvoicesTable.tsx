import { DataTable } from "@/components/Table/index";
import type { Column } from "@/components/Table/DataTable";
import { ExternalLink, Download } from "lucide-react";
import type { InvoiceSchema } from "@/features/base/billing/types";

const STATUS_STYLES: Record<string, string> = {
  paid:          "badge badge-success badge-soft",
  open:          "badge badge-info badge-soft",
  void:          "badge badge-ghost badge-soft",
  uncollectible: "badge badge-error badge-soft",
  draft:         "badge badge-warning badge-soft",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const columns: Column<InvoiceSchema>[] = [
  {
    key: "id",
    header: "Invoice",
    render: (row) => (
      <span className="font-mono text-xs text-base-content/50 bg-base-200 px-2 py-0.5 rounded">
        #{String(row.id).padStart(4, "0")}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Date",
    render: (row) => (
      <span className="text-sm text-base-content/70">
        {formatDate(row.created_at)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`badge badge-sm capitalize ${
          STATUS_STYLES[row.status] ?? "badge badge-ghost badge-soft"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "total",
    header: "Amount",
    headerClassName: "text-right",
    className: "text-right",
    render: (row) => (
      <div>
        <p className="font-semibold text-sm">
          {formatCurrency(row.total, row.currency)}
        </p>
        {row.subtotal !== row.total && (
          <p className="text-xs text-base-content/40">
            subtotal {formatCurrency(row.subtotal, row.currency)}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "hosted_invoice_url",
    header: "Links",
    headerClassName: "text-right",
    className: "text-right",
    render: (row) => (
      <div className="flex items-center justify-end gap-3">
        {row.hosted_invoice_url && (
          <a
            href={row.hosted_invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-base-content/50 hover:text-base-content transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </a>
        )}
        {row.invoice_pdf && (
          <a
            href={row.invoice_pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-base-content/50 hover:text-base-content transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        )}
      </div>
    ),
  },
];

interface InvoicesTableProps {
  data: InvoiceSchema[];
  loading?: boolean;
}

export default function InvoicesTable({ data, loading = false }: InvoicesTableProps) {
  return (
    <DataTable<InvoiceSchema>
      pinRows
      columns={columns}
      data={data}
      keyExtractor={(row) => row.id}
      loading={loading}
      skeletonRows={5}
      emptyMessage="No invoices found."
    />
  );
}