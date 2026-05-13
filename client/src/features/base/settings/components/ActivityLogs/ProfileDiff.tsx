import type { LogPropertiesSchema } from "@/features/base/settings";

export default function ProfileDiff({ properties }: { properties: LogPropertiesSchema | null }) {
    if (!properties?.old || !properties?.new) return null;

    const fields = Object.keys(properties.new).filter(
        (k) => properties.old![k] !== properties.new![k] && k !== "avatar"
    );

    if (!fields.length) return null;
    console.log(properties);
    return (
        <div className="mt-1 rounded-xl border border-base-200 bg-base-200/40 overflow-hidden">
            {fields.map((field) => (
                <div
                    key={field}
                    className="grid grid-cols-[5rem_1fr_1fr] items-center gap-2 px-3 py-2 text-xs border-b border-base-200 last:border-0"
                >
                    <span className="text-base-content/40 capitalize">{field.replace("_", " ")}</span>
                    <span className="text-error/70 line-through truncate">
                        {properties.old![field] ?? "—"}
                    </span>
                    <span className="text-success/80 truncate">
                        {properties.new![field] ?? "—"}
                    </span>
                </div>
            ))}
        </div>
    );
}