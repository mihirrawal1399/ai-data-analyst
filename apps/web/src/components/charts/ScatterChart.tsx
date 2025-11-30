'use client';

import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '@/types/chart';
import { getChartColors } from '@/lib/utils/formatters';

interface ScatterChartProps {
    data: ChartDataPoint[];
    xKey: string;
    yKey: string;
    title?: string;
}

export function ScatterChart({ data, xKey, yKey, title }: ScatterChartProps) {
    const colors = getChartColors();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                    dataKey={xKey}
                    stroke="var(--color-muted)"
                    style={{ fontSize: '12px' }}
                    type="number"
                />
                <YAxis
                    dataKey={yKey}
                    stroke="var(--color-muted)"
                    style={{ fontSize: '12px' }}
                    type="number"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                />
                <Legend
                    wrapperStyle={{ color: 'var(--color-foreground)' }}
                />
                <Scatter
                    name={yKey}
                    data={data}
                    fill={colors[0]}
                    animationDuration={500}
                />
            </RechartsScatterChart>
        </ResponsiveContainer>
    );
}
