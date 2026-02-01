export type ChartType = 'line' | 'bar' | 'pie' | 'scatter';
export interface ChartFilter {
    column: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';
    value: any;
}
export interface ChartConfig {
    datasetId: string;
    xAxis: string;
    yAxis: string;
    groupBy?: string;
    filters?: ChartFilter[];
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
    limit?: number;
}
export interface ChartDataPoint {
    [key: string]: any;
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
    data?: ChartDataPoint[];
}
export interface DashboardWithCharts {
    id: string;
    name: string;
    layout?: any;
    userId: string;
    createdAt: Date | string;
    charts: ChartWithData[];
}
