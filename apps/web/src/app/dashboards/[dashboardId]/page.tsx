'use client';

import { useEffect, useState } from 'react';
import { getDashboard } from '@/lib/api/dashboards';
import { PageHeader } from '@/components/ui/PageHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { ChartCard } from '@/components/charts/ChartCard';
import { InsightPanel } from '@/components/insights/InsightPanel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardInsights } from '@/lib/api/insight-queries';
import Link from 'next/link';
import { Sparkles, Share2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { DashboardWithCharts } from '@/types/dashboard';

interface DashboardPageProps {
    params: Promise<{ dashboardId: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
    const [dashboard, setDashboard] = useState<DashboardWithCharts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardId, setDashboardId] = useState<string>('');
    const [showInsights, setShowInsights] = useState(false);

    const { data: insights, isLoading: insightsLoading, refetch: fetchInsights } = useDashboardInsights(dashboardId);

    useEffect(() => {
        params.then(({ dashboardId }) => {
            setDashboardId(dashboardId);
            getDashboard(dashboardId, true)
                .then(setDashboard)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        });
    }, [params]);

    const handleGetInsights = async () => {
        setShowInsights(true);
        toast.promise(fetchInsights(), {
            loading: 'Analyzing dashboard with AI...',
            success: 'Insights generated!',
            error: 'Failed to generate insights',
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Skeleton className="h-10 w-64 bg-slate-900/50 mb-2" />
                    <Skeleton className="h-6 w-48 bg-slate-900/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64 bg-slate-900/50 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-12 text-center backdrop-blur-md">
                    <p className="text-rose-400 mb-2 font-bold">Error loading dashboard</p>
                    <p className="text-slate-500">{error || 'Dashboard not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Enhanced Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500">
                        {dashboard.name}
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">
                        {dashboard.charts.length} charts • Created {new Date(dashboard.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" className="border-slate-800 hover:bg-slate-800/50 text-slate-400" disabled>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Link href={`/dashboards/${dashboardId}/edit`}>
                        <Button variant="outline" className="border-slate-800 hover:bg-slate-800/50 text-slate-400">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        onClick={handleGetInsights}
                        className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 shadow-lg shadow-cyan-500/20"
                        disabled={insightsLoading}
                    >
                        <Sparkles className={`w-4 h-4 mr-2 ${insightsLoading ? 'animate-pulse' : ''}`} />
                        {insightsLoading ? 'Analyzing...' : 'AI Insights'}
                    </Button>
                    <Link href={`/datasets/${dashboard.charts[0]?.datasetId || ''}/create-chart?dashboardId=${dashboardId}`}>
                        <Button className="bg-cyan-600 hover:bg-cyan-500">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Chart
                        </Button>
                    </Link>
                </div>
            </div>

            {/* AI Insights Panel */}
            {showInsights && (
                <InsightPanel insights={insights || null} isLoading={insightsLoading} />
            )}

            {/* Chart Grid */}
            {dashboard.charts.length === 0 ? (
                <div className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-20 text-center backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
                    <p className="text-slate-400 text-lg mb-6 relative">No charts in this dashboard yet.</p>
                    <Link href={`/datasets`}>
                        <Button className="bg-cyan-600 hover:bg-cyan-500 relative">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Chart
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboard.charts.map((chart) => (
                        <ChartCard key={chart.id} chart={chart}>
                            <ChartRenderer chart={chart} />
                        </ChartCard>
                    ))}
                </div>
            )}
        </div>
    );
}
