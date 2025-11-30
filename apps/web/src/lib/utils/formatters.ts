/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}

/**
 * Transform chart data for Recharts
 */
export function transformChartData(data: any[]): any[] {
    if (!data || data.length === 0) return [];
    return data;
}

/**
 * Get chart color palette based on theme
 */
export function getChartColors(): string[] {
    return [
        'var(--color-primary-1)',
        'var(--color-primary-2)',
        'var(--color-secondary-1)',
        'var(--color-accent)',
    ];
}
