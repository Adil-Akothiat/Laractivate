# AppChart

A universal chart wrapper built on Recharts. Drop any data from your API and get a fully themed, responsive chart in one line.

---

## Installation
```bash
npm install recharts
```

Import the component:
```tsx
import { AppChart } from "@/components/AppChart";
```

---

## Props

| Prop         | Type                              | Default           | Required | Description                                      |
|--------------|-----------------------------------|-------------------|----------|--------------------------------------------------|
| `type`       | `area \| bar \| line \| pie`      | —                 | ✅       | Visual style of the chart                        |
| `data`       | `Record<string, any>[]`           | —                 | ✅       | Raw data array from your API                     |
| `index`      | `string`                          | —                 | ✅       | Key used for the X-Axis (or pie slice name)      |
| `categories` | `string[]`                        | —                 | ✅       | Keys used for the Y-Axis values                  |
| `colors`     | `string[]`                        | `DEFAULT_COLORS`  | ❌       | Hex codes applied per category in order          |
| `height`     | `number`                          | `220`             | ❌       | Chart height in pixels                           |
| `showGrid`   | `boolean`                         | `true`            | ❌       | Show/hide background grid lines                  |
| `showLegend` | `boolean`                         | `false`           | ❌       | Show/hide the category legend                    |
| `className`  | `string`                          | `""`              | ❌       | Extra classes applied to the wrapper div         |

---

## Default Colors

When no `colors` prop is provided, the chart cycles through these defaults in order:
```
#6366f1  indigo
#10b981  emerald
#f59e0b  amber
#ef4444  red
#8b5cf6  violet
#06b6d4  cyan
```

---

## Usage

### Line Chart
```tsx
<AppChart
    type="line"
    data={[
        { date: "Apr 1", users: 10 },
        { date: "Apr 2", users: 24 },
        { date: "Apr 3", users: 18 },
    ]}
    index="date"
    categories={["users"]}
    colors={["#6366f1"]}
/>
```

### Area Chart
```tsx
<AppChart
    type="area"
    data={metricsData}
    index="date"
    categories={["logins", "signups"]}
    colors={["#6366f1", "#10b981"]}
    height={300}
    showLegend
/>
```

### Bar Chart
```tsx
<AppChart
    type="bar"
    data={salesData}
    index="month"
    categories={["revenue", "expenses"]}
    colors={["#10b981", "#ef4444"]}
    showLegend
/>
```

### Pie / Donut Chart
```tsx
<AppChart
    type="pie"
    data={[
        { role: "Admin", count: 3 },
        { role: "Editor", count: 12 },
        { role: "Viewer", count: 40 },
    ]}
    index="role"
    categories={["count"]}
    showLegend
/>
```

> **Note:** For `pie` charts, only the first value in `categories` is used as the slice value. `colors` are applied per data entry, not per category.

---

## With API Data

Map your Laravel API response directly into `data` — no adapter needed as long as your response is a flat array of objects:
```tsx
const { data } = useUserGrowth();

const chartData = data?.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Users: d.count,
}));

<AppChart
    type="line"
    data={chartData}
    index="date"
    categories={["Users"]}
/>
```

---

## Theming

`AppChart` uses DaisyUI CSS variables for all chrome (grid, axes, tooltip background), so it automatically respects your active theme including dark mode — no extra configuration required.

| Element          | CSS Variable used          |
|------------------|----------------------------|
| Grid lines       | `oklch(var(--b3))`         |
| Axis strokes     | `oklch(var(--bc) / 0.2)`   |
| Axis text        | `oklch(var(--bc) / 0.4)`   |
| Tooltip bg       | `oklch(var(--b1))`         |
| Tooltip border   | `oklch(var(--b3))`         |

---

## Notes

- `height` defaults to `220px`. For dashboard cards, `200–260` works well. For full-width sections, use `320–400`.
- `showGrid` is enabled by default. Disable it for minimal/clean layouts: `showGrid={false}`.
- `showLegend` is off by default. Enable it when rendering multiple `categories` on the same chart.
- All chart types are fully responsive via Recharts' `ResponsiveContainer`.