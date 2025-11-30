import type { ChartType, ChartConfig, ChartFilter, Chart, ChartWithData, ChartDataPoint } from '@repo/shared-types';

export type { ChartType, ChartConfig, ChartFilter, Chart, ChartWithData, ChartDataPoint };

export interface CreateChartDto {
    dashboardId: string;
    datasetId: string;
    title?: string;
    type: ChartType;
    config: ChartConfig;
}

export interface UpdateChartDto {
    title?: string;
    type?: ChartType;
    config?: ChartConfig;
}
