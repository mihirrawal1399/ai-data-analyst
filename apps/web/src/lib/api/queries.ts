'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboard, getDashboards, createDashboard, updateDashboard, deleteDashboard } from './dashboards';
import { getChart, getChartData, createChart, updateChart, deleteChart } from './charts';
import { apiPost } from './client';

// Dashboard Queries
export function useDashboards() {
    return useQuery({
        queryKey: ['dashboards'],
        queryFn: getDashboards,
    });
}

export function useDashboard(id: string, includeData = false) {
    return useQuery({
        queryKey: ['dashboard', id, includeData],
        queryFn: () => getDashboard(id, includeData),
        enabled: !!id,
    });
}

export function useCreateDashboard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDashboard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboards'] });
        },
    });
}

// Chart Queries
export function useChart(id: string, includeData = false) {
    return useQuery({
        queryKey: ['chart', id, includeData],
        queryFn: () => getChart(id, includeData),
        enabled: !!id,
    });
}

export function useChartData(id: string) {
    return useQuery({
        queryKey: ['chart-data', id],
        queryFn: () => getChartData(id),
        enabled: !!id,
    });
}

export function useCreateChart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createChart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboards'] });
        },
    });
}

// Chart Preview (for chart builder)
export function useChartPreview(datasetId: string, config: any) {
    return useQuery({
        queryKey: ['chart-preview', datasetId, config],
        queryFn: () =>
            apiPost('/agent/query', {
                datasetId,
                question: `Generate chart data for: ${config.type} chart`,
                limit: 100,
            }),
        enabled: !!datasetId && !!config.xAxis && !!config.yAxis,
    });
}

// MCP Health Check
export function useMcpHealth() {
    return useQuery({
        queryKey: ['mcp-health'],
        queryFn: () => apiPost('/mcp/db/health', {}),
        refetchInterval: 30000, // Refetch every 30s
    });
}
