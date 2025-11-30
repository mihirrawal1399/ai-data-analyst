'use client';

import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/api/dashboards';
import { PageHeader } from '@/components/ui/PageHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import type { DashboardWithCharts } from '@/types/dashboard';

interface DashboardPageProps {
    params: Promise<{ dashboardId: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
    const [dashboard, setDashboard] = useState<DashboardWithCharts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardId, setDashboardId] = useState<string>('');

    useEffect(() => {
        params.then(({ dashboardId }) => {
            setDashboardId(dashboardId);
            getDashboard(dashboardId, true)
                .then(setDashboard)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        });
    }, [params]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-surface animate-pulse rounded mb-2" />
                    <div className="h-6 w-48 bg-surface animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-surface rounded-lg p-6">
                            <ChartSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="glass-surface rounded-lg p-12 text-center">
                    <p className="text-red-400 mb-2">Error loading dashboard</p>
                    <p className="text-muted">{error || 'Dashboard not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={dashboard.name}
                description={`${dashboard.charts.length} charts`}
                actions={
                    <div className="flex gap-2">
                        <Link href={`/dashboards/${dashboardId}/edit`}>
                            <NeonButton variant="outline">Edit</NeonButton>
                        </Link>
                        <Link href={`/datasets/${dashboard.charts[0]?.datasetId || ''}/create-chart?dashboardId=${dashboardId}`}>
                            <NeonButton>Add Chart</NeonButton>
                        </Link>
                    </div>
                }
            />

            {dashboard.charts.length === 0 ? (
                <div className="glass-surface rounded-lg p-12 text-center">
                    <p className="text-muted text-lg mb-4">No charts in this dashboard</p>
                    <NeonButton>Add Your First Chart</NeonButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboard.charts.map((chart) => (
                        <ChartContainer
                            key={chart.id}
                            title={chart.title}
                            error={(chart as any).error}
                        >
                            <ChartRenderer chart={chart} />
                        </ChartContainer>
                    ))}
                </div>
            )}
        </div>
    );
}
