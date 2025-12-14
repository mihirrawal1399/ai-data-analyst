/** Vaporwave color palette for charts and UI */
export const VAPOR_PALETTE = [
    '#8a5cff', // Purple
    '#00e0e0', // Cyan
    '#ff68a6', // Pink
    '#ffe066', // Yellow
    '#9d4edd', // Deep purple
    '#7df9ff', // Electric blue
] as const;

/** Recharts theme configuration */
export const CHART_THEME = {
    grid: {
        stroke: 'rgba(255, 255, 255, 0.1)',
        strokeDasharray: '3 3',
    },
    tooltip: {
        contentStyle: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            border: '1px solid rgba(138, 92, 255, 0.3)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            padding: '12px',
        },
        labelStyle: {
            color: '#fff',
            fontWeight: 600,
        },
        itemStyle: {
            color: '#9ca3af',
        },
    },
    axis: {
        stroke: '#fff',
        tick: { fill: '#9ca3af' },
    },
} as const;

/** Chart color by index */
export function getChartColor(index: number): string {
    return VAPOR_PALETTE[index % VAPOR_PALETTE.length];
}
