// Shared types for Chart configurations and data

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter';

export interface ChartFilter {
    column: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';
    value: any;
}

export interface ChartConfig {
    datasetId: string;
    xAxis: string;        // column name for x-axis
    yAxis: string;        // column name or aggregation (e.g., "COUNT(*)", "SUM(amount)")
    groupBy?: string;     // optional grouping column
    filters?: ChartFilter[];  // optional WHERE conditions
    orderBy?: string;     // optional ORDER BY column
    orderDirection?: 'ASC' | 'DESC';
    limit?: number;       // optional result limit (default: 1000)
}

export interface ChartDataPoint {
    [key: string]: any;   // Dynamic keys based on xAxis/yAxis
}

export interface Chart {
    id: string;
    title?: string;
    type: ChartType;
    config: ChartConfig;
    dashboardId: string;
    datasetId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ChartWithData extends Chart {
    data?: ChartDataPoint[];  // Optional executed data
}

export interface DashboardWithCharts {
    id: string;
    name: string;
    layout?: any;
    userId: string;
    createdAt: Date | string;
    charts: ChartWithData[];
}
