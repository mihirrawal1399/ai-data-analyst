import { apiClient } from './client';
import { CreateAutomationDto, UpdateAutomationDto, AutomationHistoryResult } from '@repo/shared-types/automation';

export const automationsApi = {
    list: (userId: string) =>
        apiClient.get<any[]>(`/automations?userId=${userId}`),

    get: (id: string) =>
        apiClient.get<any>(`/automations/${id}`),

    create: (doc: CreateAutomationDto) =>
        apiClient.post<any>('/automations', doc),

    update: (id: string, doc: UpdateAutomationDto) =>
        apiClient.put<any>(`/automations/${id}`, doc),

    remove: (id: string) =>
        apiClient.delete<any>(`/automations/${id}`),

    execute: (id: string) =>
        apiClient.post<any>(`/automations/${id}/execute`),

    getResults: (id: string, limit?: number) =>
        apiClient.get<AutomationHistoryResult[]>(`/automations/${id}/results${limit ? `?limit=${limit}` : ''}`),
};
