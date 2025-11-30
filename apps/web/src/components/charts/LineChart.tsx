'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '@/types/chart';
import { getChartColors } from '@/lib/utils/formatters';

interface LineChartProps {
    data: ChartDataPoint[];
    xKey: string;
    yKey: string;
    title?: string;
}

export function LineChart({ data, xKey, yKey, title }: LineChartProps) {
    const colors = getChartColors();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                    dataKey={xKey}
                    stroke="var(--color-muted)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="var(--color-muted)"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)',
                    }}
                />
                <Legend
                    wrapperStyle={{ color: 'var(--color-foreground)' }}
                />
                <Line
                    type="monotone"
                    dataKey={yKey}
                    stroke={colors[0]}
                    strokeWidth={2}
                    dot={{ fill: colors[0], r: 4 }}
                    activeDot={{ r: 6, fill: colors[1] }}
                    animationDuration={500}
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
}
