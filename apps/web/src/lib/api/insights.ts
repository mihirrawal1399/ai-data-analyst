import { apiClient } from './client';
import { DashboardInsight, DatasetInsight } from '@repo/shared-types/insights';

export const insightsApi = {
    getDashboardInsights: (dashboardId: string) =>
        apiClient.post<DashboardInsight>(`/agent/insights/dashboard/${dashboardId}`).then(res => res.data),

    getDatasetInsights: (datasetId: string) =>
        apiClient.post<DatasetInsight>(`/agent/insights/dataset/${datasetId}`).then(res => res.data),

    suggestCharts: (datasetId: string) =>
        apiClient.post(`/agent/suggest-charts/${datasetId}`).then(res => res.data),

    refreshChart: (chartId: string) =>
        apiClient.put(`/charts/${chartId}/refresh`).then(res => res.data),
};
