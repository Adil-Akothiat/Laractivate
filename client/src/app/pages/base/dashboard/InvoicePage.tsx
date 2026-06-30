import { InvoicesTable } from "@/features/base/billing/components/InvoicesTable";

export default function InvoicePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Invoice Page</h1>
            <InvoicesTable />
        </div>
    );
}