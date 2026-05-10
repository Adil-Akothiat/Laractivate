import { Users } from "lucide-react";
import { AppChart } from "../../../../../components/Chart";
import type { CompositionItem } from "../../types";

type Props = {
    composition: CompositionItem[];
};

export function UserComposition({ composition }: Props) {
    const total = composition.reduce((sum, c) => sum + c.value, 0);

    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <h2 className="font-semibold text-sm">User Composition</h2>
                </div>
                <span className="badge badge-ghost badge-sm font-mono">{total} total</span>
            </div>

            {/* Chart */}
            <div className="flex items-center gap-6 px-6 py-4">
                <div className="shrink-0">
                    <AppChart
                        type="pie"
                        data={composition}
                        index="name"
                        categories={["value"]}
                        colors={composition.map((c) => c.color)}
                        height={120}
                        showLegend={false}
                    />
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                    {composition.map((item) => {
                        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        return (
                            <div key={item.name} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-xs text-base-content/60 font-medium truncate">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-bold text-base-content tabular-nums">
                                        {item.value}
                                    </span>
                                    <span className="text-[10px] text-base-content/35 font-mono w-8 text-right">
                                        {pct}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}