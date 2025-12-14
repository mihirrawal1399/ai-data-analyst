'use client';

import { ChartRenderer } from '../charts/ChartRenderer';

interface ChartPreviewProps {
    config: any;
    data: any;
    isLoading: boolean;
}

/**
 * Live preview of chart configuration
 */
export function ChartPreview({ config, data, isLoading }: ChartPreviewProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-glow-pulse text-glow text-4xl mb-4">⚡</div>
                    <p className="text-muted">Generating preview...</p>
                </div>
            </div>
        );
    }

    if (!config.xAxis || !config.yAxis) {
        return (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-glow/30 rounded-lg">
                <p className="text-muted">Select axes to preview chart</p>
            </div>
        );
    }

    if (!data || !data.results?.rows || data.results.rows.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-glow/30 rounded-lg">
                <p className="text-muted">No data available</p>
            </div>
        );
    }

    return (
        <div className="h-96">
            <ChartRenderer
                chart={{ type: config.type, config }}
                data={data.results.rows}
            />
        </div>
    );
}
