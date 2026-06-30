import React from 'react';
import type { InvoicesTableProps } from '../types';
import { useInvoicesQuery } from '../hooks/api/useBillingQueries';

export const InvoicesTable: React.FC<InvoicesTableProps> = () => {
  const { data:invoices, isLoading, isError } = useInvoicesQuery();
  console.log(invoices);
  if (isLoading) return <div className="p-4 text-center text-sm text-base-content/60">Syncing transaction history records...</div>;
  if (isError || !invoices) return <div className="p-4 text-sm text-error">Failed to pull system billing logs securely.</div>;

  return (
    <div className="overflow-x-auto w-full border border-base-200 rounded-xl bg-base-100">
      <table className="table table-zebra w-full text-sm">
        <thead>
          <tr className="bg-base-200/50">
            <th>Transaction Date</th>
            <th>Amount Incurred</th>
            <th>Billing Status</th>
            <th className="text-right">Receipt / Manifest</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-base-200/30 transition-colors">
              <td className="font-medium">
                {new Date(invoice.created_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </td>
              <td className="font-semibold text-base-content">
                {(invoice.total / 100).toFixed(2)} <span className="text-xs text-base-content/60 uppercase">{invoice.currency}</span>
              </td>
              <td>
                <span className={`badge badge-sm uppercase tracking-wider font-bold px-2 py-1 ${
                  invoice.status === 'paid' ? 'badge-success text-white' : 'badge-warning'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="text-right">
                <a 
                  href={invoice.invoice_pdf || invoice.hosted_invoice_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-ghost btn-xs text-primary font-bold normal-case gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16s1 4 9 4 9-4 9-4M12 3v13m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Get PDF
                </a>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-12 text-base-content/50 italic">
                No past billing records captured under this dashboard account profile context.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};