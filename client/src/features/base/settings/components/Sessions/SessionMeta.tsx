import { Clock, Globe, MapPin, TimerIcon } from "lucide-react";
import type { UserSession } from "../../types";

export default function SessionMeta({ session }: { session: UserSession }) {
    const location = [session.city, session.country].filter(Boolean).join(", ");

    return (
        <div className="flex flex-col gap-1 mt-1.5">
            <div className="flex items-center gap-3 text-xs text-base-content/40 flex-wrap">
                <span className="flex items-center gap-1">
                    <Globe size={11} />
                    {session.ip_address}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {session.last_active}
                </span>
            </div>

            {(location || session.timezone) && (
                <div className="flex items-center gap-3 text-xs text-base-content/40 flex-wrap">
                    {location && (
                        <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {location}
                        </span>
                    )}
                    {session.timezone && (
                        <span className="flex items-center gap-1">
                            <TimerIcon size={11} />
                            {session.timezone}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}