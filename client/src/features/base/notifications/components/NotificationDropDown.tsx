import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

type DropDownContentProps = {
    header: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
};

type Props = {
    summary: ReactNode;
    dropDownContent: DropDownContentProps;
};

export default function NotificationDropDown({ summary, dropDownContent }: Props) {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
                detailsRef.current.removeAttribute("open");
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <details ref={detailsRef} className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-sm btn-circle relative list-none">
                {summary}
            </summary>
            <div className="dropdown-content bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-50 w-80 mt-2 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                    {dropDownContent.header}
                </div>
                <ul className="flex flex-col p-0 m-0 max-h-80 overflow-y-auto divide-y divide-base-200 w-full ">
                    {dropDownContent.body}
                </ul>
                {dropDownContent?.footer && (
                    <div className="px-4 py-2.5 border-t border-base-300 text-center">
                        <Link   
                            to="/notifications"
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            View all notifications
                        </Link>
                    </div>
                )}
            </div>
        </details>
    );
}