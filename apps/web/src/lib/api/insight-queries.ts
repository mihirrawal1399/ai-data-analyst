import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insightsApi } from './insights';

export function useDashboardInsights(dashboardId: string) {
    return useQuery({
        queryKey: ['dashboard-insights', dashboardId],
        queryFn: () => insightsApi.getDashboardInsights(dashboardId),
        enabled: false, // Only fetch on demand
        staleTime: 5 * 60 * 1000,
    });
}

export function useDatasetInsights(datasetId: string) {
    return useQuery({
        queryKey: ['dataset-insights', datasetId],
        queryFn: () => insightsApi.getDatasetInsights(datasetId),
        enabled: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useChartSuggestions(datasetId: string) {
    return useQuery({
        queryKey: ['chart-suggestions', datasetId],
        queryFn: () => insightsApi.suggestCharts(datasetId),
        enabled: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useRefreshChart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chartId: string) => insightsApi.refreshChart(chartId),
        onSuccess: (_, chartId) => {
            queryClient.invalidateQueries({ queryKey: ['chart', chartId] });
        },
    });
}
