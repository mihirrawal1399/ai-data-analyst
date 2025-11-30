'use client';

import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';

interface ChartContainerProps {
    title?: string;
    description?: string;
    loading?: boolean;
    error?: string;
    children: ReactNode;
}

export function ChartContainer({ title, description, loading, error, children }: ChartContainerProps) {
    return (
        <Card className="p-6">
            {title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    {description && <p className="text-sm text-muted mt-1">{description}</p>}
                </div>
            )}

            {loading ? (
                <ChartSkeleton />
            ) : error ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-400 mb-2">Error loading chart</p>
                        <p className="text-sm text-muted">{error}</p>
                    </div>
                </div>
            ) : (
                <div className="h-64">
                    {children}
                </div>
            )}
        </Card>
    );
}
