import { Monitor, Smartphone } from "lucide-react";

export default function DeviceIcon({
    device,
    active,
}: {
    device: string;
    active: boolean;
}) {
    const d = device.toLowerCase();
    const icon =
        d.includes("mobile") || d.includes("phone") || d.includes("tablet") ? (
            <Smartphone size={16} />
        ) : (
            <Monitor size={16} />
        );

    return (
        <div
            className={[
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                active
                    ? "bg-primary/10 text-primary"
                    : "bg-base-200 text-base-content/40",
            ].join(" ")}
        >
            {icon}
        </div>
    );
}