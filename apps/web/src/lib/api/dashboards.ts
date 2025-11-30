import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Dashboard, DashboardWithCharts, CreateDashboardDto, UpdateDashboardDto } from '@/types/dashboard';

export async function getDashboards(): Promise<Dashboard[]> {
    return apiGet<Dashboard[]>('/dashboards');
}

export async function getDashboard(id: string, includeData = false): Promise<DashboardWithCharts> {
    const query = includeData ? '?includeData=true' : '';
    return apiGet<DashboardWithCharts>(`/dashboards/${id}${query}`);
}

export async function createDashboard(data: CreateDashboardDto): Promise<Dashboard> {
    return apiPost<Dashboard>('/dashboards', data);
}

export async function updateDashboard(id: string, data: UpdateDashboardDto): Promise<Dashboard> {
    return apiPut<Dashboard>(`/dashboards/${id}`, data);
}

export async function deleteDashboard(id: string): Promise<void> {
    return apiDelete<void>(`/dashboards/${id}`);
}
