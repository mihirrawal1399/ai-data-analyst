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
    return apiClient('/datasets');
}

export async function getDataset(id: string): Promise<Dataset> {
    return apiClient(`/datasets/${id}`);
}

export async function deleteDataset(id: string): Promise<void> {
    return apiClient(`/datasets/${id}`, { method: 'DELETE' });
}
