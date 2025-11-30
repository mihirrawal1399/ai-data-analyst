'use client';

import type { ChartWithData } from '@/types/chart';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { ScatterChart } from './ScatterChart';

interface ChartRendererProps {
    chart: ChartWithData;
}

export function ChartRenderer({ chart }: ChartRendererProps) {
    const { type, data, config } = chart;

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted">
                No data available
            </div>
        );
    }

    const xKey = config.xAxis;
    const yKey = config.yAxis.includes('(') ? 'value' : config.yAxis;

    switch (type) {
        case 'line':
            return <LineChart data={data} xKey={xKey} yKey={yKey} title={chart.title} />;

        case 'bar':
            return <BarChart data={data} xKey={xKey} yKey={yKey} title={chart.title} />;

        case 'pie':
            return <PieChart data={data} nameKey={xKey} valueKey={yKey} title={chart.title} />;

        case 'scatter':
            return <ScatterChart data={data} xKey={xKey} yKey={yKey} title={chart.title} />;

        default:
            return (
                <div className="flex items-center justify-center h-64 text-muted">
                    Unsupported chart type: {type}
                </div>
            );
    }
}
