import { TrendingUp } from "lucide-react";
import { AppChart } from "@/components/Chart";

type Props = {
    userGrowth: { date: string; count: number }[];
};

export function UserGrowthChart({ userGrowth }: Props) {
    const data = userGrowth.map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Users: d.count,
    }));

    return (
        <div className="lg:col-span-2 rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <h2 className="font-semibold text-sm">User Growth</h2>
                </div>
                <span className="badge badge-ghost badge-sm font-mono">
                    {data.at(-1)?.date}
                </span>
            </div>
            <div className="p-4">
                <AppChart
                    type="line"
                    data={data}
                    index="date"
                    categories={["Users"]}
                    colors={["#6366f1"]}
                    height={200}
                />
            </div>
        </div>
    );
}