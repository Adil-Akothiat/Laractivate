import {
    AreaChart, Area,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type ChartType = "area" | "bar" | "line" | "pie";

export interface AppChartProps {
    type: ChartType;
    data: Record<string, any>[];
    index: string;
    categories: string[];
    colors?: string[];
    height?: number;
    showGrid?: boolean;
    showLegend?: boolean;
    className?: string;
}


const DEFAULT_COLORS = [
    "#6366f1", // indigo
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
];

const TOOLTIP_STYLE = {
    backgroundColor: "oklch(var(--b1))",
    border: "1px solid oklch(var(--b3))",
    borderRadius: "12px",
    fontSize: "12px",
};

const AXIS_STYLE = {
    fontSize: 11,
    fill: "oklch(var(--bc) / 0.4)",
};


function renderArea(
    data: AppChartProps["data"],
    index: string,
    categories: string[],
    colors: string[],
    showGrid: boolean,
    showLegend: boolean,
) {
    return (
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
                {categories.map((cat, i) => (
                    <linearGradient key={cat} id={`gradient-${cat}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[i] ?? DEFAULT_COLORS[i]} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={colors[i] ?? DEFAULT_COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--b3))" />}
            <XAxis dataKey={index} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <YAxis allowDecimals={false} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {categories.map((cat, i) => (
                <Area
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={colors[i] ?? DEFAULT_COLORS[i]}
                    strokeWidth={2}
                    fill={`url(#gradient-${cat})`}
                    dot={{ fill: colors[i] ?? DEFAULT_COLORS[i], r: 3 }}
                    activeDot={{ r: 5 }}
                />
            ))}
        </AreaChart>
    );
}

function renderLine(
    data: AppChartProps["data"],
    index: string,
    categories: string[],
    colors: string[],
    showGrid: boolean,
    showLegend: boolean,
) {
    return (
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--b3))" />}
            <XAxis dataKey={index} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <YAxis allowDecimals={false} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {categories.map((cat, i) => (
                <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={colors[i] ?? DEFAULT_COLORS[i]}
                    strokeWidth={2}
                    dot={{ fill: colors[i] ?? DEFAULT_COLORS[i], r: 3 }}
                    activeDot={{ r: 5 }}
                />
            ))}
        </LineChart>
    );
}

function renderBar(
    data: AppChartProps["data"],
    index: string,
    categories: string[],
    colors: string[],
    showGrid: boolean,
    showLegend: boolean,
) {
    return (
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--b3))" />}
            <XAxis dataKey={index} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <YAxis allowDecimals={false} tick={AXIS_STYLE} stroke="oklch(var(--bc) / 0.2)" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
            {categories.map((cat, i) => (
                <Bar
                    key={cat}
                    dataKey={cat}
                    fill={colors[i] ?? DEFAULT_COLORS[i]}
                    radius={[4, 4, 0, 0]}
                />
            ))}
        </BarChart>
    );
}

function renderPie(
    data: AppChartProps["data"],
    index: string,
    categories: string[],
    colors: string[],
    showLegend: boolean,
) {
    return (
        <PieChart>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
            <Pie
                data={data}
                dataKey={categories[0]}
                nameKey={index}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={3}
            >
                {data.map((_, i) => (
                    <Cell key={i} fill={colors[i] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );
}

// ── AppChart ───────────────────────────────────────────────────────────────

export function AppChart({
    type,
    data,
    index,
    categories,
    colors = DEFAULT_COLORS,
    height = 220,
    showGrid = true,
    showLegend = false,
    className = "",
}: AppChartProps) {
    const chart = () => {
        switch (type) {
            case "area": return renderArea(data, index, categories, colors, showGrid, showLegend);
            case "line": return renderLine(data, index, categories, colors, showGrid, showLegend);
            case "bar":  return renderBar(data, index, categories, colors, showGrid, showLegend);
            case "pie":  return renderPie(data, index, categories, colors, showLegend);
        }
    };

    return (
        <div className={className} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                {chart()}
            </ResponsiveContainer>
        </div>
    );
}