import { apiClient } from './client';
import { DashboardInsight, DatasetInsight } from '@repo/shared-types/insights';

export const insightsApi = {
    getDashboardInsights: (dashboardId: string) =>
        apiClient.post<DashboardInsight>(`/agent/insights/dashboard/${dashboardId}`),

    getDatasetInsights: (datasetId: string) =>
        apiClient.post<DatasetInsight>(`/agent/insights/dataset/${datasetId}`),

    suggestCharts: (datasetId: string) =>
        apiClient.post<any>(`/agent/suggest-charts/${datasetId}`),

    refreshChart: (chartId: string) =>
        apiClient.put<any>(`/charts/${chartId}/refresh`),
};
