'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { getDashboards } from '@/lib/api/dashboards';
import { Card } from '@/components/ui/Card';
import type { Dashboard } from '@/types/dashboard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardsPage() {
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboards()
            .then(setDashboards)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-16 w-64 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-12 text-center">
                    <p className="text-red-400 mb-2">Error loading dashboards</p>
                    <p className="text-muted">{error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Dashboards"
                description="Manage and view your data dashboards"
                actions={
                    <Link href="/dashboards/create">
                        <NeonButton>Create Dashboard</NeonButton>
                    </Link>
                }
            />

            {dashboards.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted text-lg mb-4">No dashboards yet</p>
                    <Link href="/dashboards/create">
                        <NeonButton>Create Your First Dashboard</NeonButton>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboards.map((dashboard) => (
                        <Link key={dashboard.id} href={`/dashboards/${dashboard.id}`}>
                            <Card className="p-6 hover:scale-105 transition-transform cursor-pointer">
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {dashboard.name}
                                </h3>
                                <p className="text-sm text-muted">
                                    Created {new Date(dashboard.createdAt).toLocaleDateString()}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
