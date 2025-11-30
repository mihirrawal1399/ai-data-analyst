'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '@/types/chart';
import { getChartColors } from '@/lib/utils/formatters';

interface BarChartProps {
    data: ChartDataPoint[];
    xKey: string;
    yKey: string;
    title?: string;
}

export function BarChart({ data, xKey, yKey, title }: BarChartProps) {
    const colors = getChartColors();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors[0]} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={colors[1]} stopOpacity={0.3} />
                    </linearGradient>
                </defs>
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
                <Bar
                    dataKey={yKey}
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    animationDuration={500}
                />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}
