import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationsApi } from './automations';
import { CreateAutomationDto, UpdateAutomationDto } from '@repo/shared-types/automation';

export function useAutomations(userId: string) {
    return useQuery({
        queryKey: ['automations', userId],
        queryFn: () => automationsApi.list(userId),
        enabled: !!userId,
    });
}

export function useAutomation(id: string) {
    return useQuery({
        queryKey: ['automation', id],
        queryFn: () => automationsApi.get(id),
        enabled: !!id,
    });
}

export function useAutomationResults(id: string, limit?: number) {
    return useQuery({
        queryKey: ['automation-results', id, limit],
        queryFn: () => automationsApi.getResults(id, limit),
        enabled: !!id,
    });
}

export function useCreateAutomation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (doc: CreateAutomationDto) => automationsApi.create(doc),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['automations', variables.userId] });
        },
    });
}

export function useUpdateAutomation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, doc }: { id: string; doc: UpdateAutomationDto }) =>
            automationsApi.update(id, doc),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['automation', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['automations'] });
        },
    });
}

export function useRemoveAutomation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => automationsApi.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['automations'] });
        },
    });
}

export function useExecuteAutomation() {
    return useMutation({
        mutationFn: (id: string) => automationsApi.execute(id),
    });
}
