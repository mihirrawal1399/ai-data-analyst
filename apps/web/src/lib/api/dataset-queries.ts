'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatasets, getDataset, deleteDataset } from './datasets';

export function useDatasets() {
    return useQuery({
        queryKey: ['datasets'],
        queryFn: getDatasets,
    });
}

export function useDataset(id: string) {
    return useQuery({
        queryKey: ['dataset', id],
        queryFn: () => getDataset(id),
        enabled: !!id,
    });
}

export function useDeleteDataset() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDataset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
        },
    });
}
