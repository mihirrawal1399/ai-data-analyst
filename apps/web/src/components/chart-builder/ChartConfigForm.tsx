'use client';

import { AxisSelector } from './AxisSelector';

interface ChartConfig {
    type: 'line' | 'bar' | 'pie' | 'scatter';
    xAxis: string;
    yAxis: string;
    title?: string;
}

interface ChartConfigFormProps {
    config: ChartConfig;
    onChange: (config: ChartConfig) => void;
    columns: string[];
}

const CHART_TYPES = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
] as const;

/**
 * Form for configuring chart properties
 */
export function ChartConfigForm({ config, onChange, columns }: ChartConfigFormProps) {
    return (
        <div className="space-y-4">
            {/* Chart Type */}
            <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                    Chart Type
                </label>
                <select
                    value={config.type}
                    onChange={(e) => onChange({ ...config, type: e.target.value as any })}
                    className="w-full bg-surface border border-glow/30 rounded-lg px-4 py-2 
                     text-foreground focus:outline-none focus:border-glow 
                     transition-colors duration-200"
                >
                    {CHART_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chart Title */}
            <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                    Chart Title
                </label>
                <input
                    type="text"
                    value={config.title || ''}
                    onChange={(e) => onChange({ ...config, title: e.target.value })}
                    placeholder="Enter chart title..."
                    className="w-full bg-surface border border-glow/30 rounded-lg px-4 py-2 
                     text-foreground placeholder-muted focus:outline-none focus:border-glow 
                     transition-colors duration-200"
                />
            </div>

            {/* X-Axis */}
            <AxisSelector
                label="X-Axis"
                columns={columns}
                value={config.xAxis}
                onChange={(value) => onChange({ ...config, xAxis: value })}
            />

            {/* Y-Axis */}
            <AxisSelector
                label="Y-Axis"
                columns={columns}
                value={config.yAxis}
                onChange={(value) => onChange({ ...config, yAxis: value })}
            />
        </div>
    );
}
