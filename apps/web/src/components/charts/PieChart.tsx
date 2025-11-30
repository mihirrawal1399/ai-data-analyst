'use client';

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '@/types/chart';
import { getChartColors } from '@/lib/utils/formatters';

interface PieChartProps {
    data: ChartDataPoint[];
    nameKey: string;
    valueKey: string;
    title?: string;
}

export function PieChart({ data, nameKey, valueKey, title }: PieChartProps) {
    const colors = getChartColors();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
                <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry[nameKey]}
                    animationDuration={500}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
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
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}
