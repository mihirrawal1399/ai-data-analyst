import { apiClient } from './client';

export interface Dataset {
    id: string;
    name: string;
    filename: string;
    sizeBytes: number;
    rowCount: number;
    createdAt: string;
    updatedAt: string;
}

export async function getDatasets(): Promise<Dataset[]> {
    return apiClient.get<Dataset[]>('/datasets');
}

export async function getDataset(id: string): Promise<Dataset> {
    return apiClient.get<Dataset>(`/datasets/${id}`);
}

export async function deleteDataset(id: string): Promise<void> {
    return apiClient.delete<void>(`/datasets/${id}`);
}
