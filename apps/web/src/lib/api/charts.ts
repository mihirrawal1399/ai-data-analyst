import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Chart, ChartWithData, ChartDataPoint, CreateChartDto, UpdateChartDto } from '@/types/chart';

export async function getChart(id: string, includeData = false): Promise<ChartWithData> {
    const query = includeData ? '?includeData=true' : '';
    return apiGet<ChartWithData>(`/charts/${id}${query}`);
}

export async function getChartData(id: string): Promise<ChartDataPoint[]> {
    return apiGet<ChartDataPoint[]>(`/charts/${id}/data`);
}

export async function createChart(data: CreateChartDto): Promise<Chart> {
    return apiPost<Chart>('/charts', data);
}

export async function updateChart(id: string, data: UpdateChartDto): Promise<Chart> {
    return apiPut<Chart>(`/charts/${id}`, data);
}

export async function deleteChart(id: string): Promise<void> {
    return apiDelete<void>(`/charts/${id}`);
}
