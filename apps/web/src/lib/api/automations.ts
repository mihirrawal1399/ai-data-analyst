import { apiClient } from './client';
import { CreateAutomationDto, UpdateAutomationDto, AutomationHistoryResult } from '@repo/shared-types/automation';

export const automationsApi = {
    list: (userId: string) =>
        apiClient.get(`/automations?userId=${userId}`).then(res => res.data),

    get: (id: string) =>
        apiClient.get(`/automations/${id}`).then(res => res.data),

    create: (doc: CreateAutomationDto) =>
        apiClient.post('/automations', doc).then(res => res.data),

    update: (id: string, doc: UpdateAutomationDto) =>
        apiClient.put(`/automations/${id}`, doc).then(res => res.data),

    remove: (id: string) =>
        apiClient.delete(`/automations/${id}`).then(res => res.data),

    execute: (id: string) =>
        apiClient.post(`/automations/${id}/execute`).then(res => res.data),

    getResults: (id: string, limit?: number) =>
        apiClient.get(`/automations/${id}/results${limit ? `?limit=${limit}` : ''}`).then(res => res.data),
};
