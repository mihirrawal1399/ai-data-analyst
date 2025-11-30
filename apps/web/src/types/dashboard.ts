import type { DashboardWithCharts } from '@repo/shared-types';

export type { DashboardWithCharts };

export interface Dashboard {
    id: string;
    name: string;
    layout?: any;
    userId: string;
    createdAt: string;
}

export interface CreateDashboardDto {
    name: string;
    userId: string;
    layout?: any;
}

export interface UpdateDashboardDto {
    name?: string;
    layout?: any;
}
