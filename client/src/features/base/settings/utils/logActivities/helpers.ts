import type { LogPropertiesSchema } from "../../types";


export function relativeTime(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function fullDate(dateStr: string) {
    return new Date(dateStr).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function parseDevice(properties: LogPropertiesSchema | null) {
    if (!properties) return null;
    const parts: string[] = [];
    if (properties.browser) parts.push(properties.browser);
    if (properties.platform) parts.push(properties.platform);
    return parts.length ? parts.join(" on ") : null;
}
