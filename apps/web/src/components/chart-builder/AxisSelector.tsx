'use client';

interface AxisSelectorProps {
    label: string;
    columns: string[];
    value: string;
    onChange: (value: string) => void;
}

/**
 * Dropdown selector for chart axes
 */
export function AxisSelector({ label, columns, value, onChange }: AxisSelectorProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-foreground">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-surface border border-glow/30 rounded-lg px-4 py-2 
                   text-foreground focus:outline-none focus:border-glow 
                   transition-colors duration-200"
            >
                <option value="">Select column...</option>
                {columns.map((col) => (
                    <option key={col} value={col}>
                        {col}
                    </option>
                ))}
            </select>
        </div>
    );
}
