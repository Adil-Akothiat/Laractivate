export function SessionRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-base-content/30 shrink-0">{label}</span>
            <span className="text-right font-medium text-base-content/60">{value}</span>
        </div>
    );
}