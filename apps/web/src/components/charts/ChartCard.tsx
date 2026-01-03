'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { useRefreshChart } from '@/lib/api/insight-queries';
import { toast } from 'sonner';

interface ChartCardProps {
    chart: any;
    children: React.ReactNode;
}

export function ChartCard({ chart, children }: ChartCardProps) {
    const refreshMutation = useRefreshChart();
    const [isHovered, setIsHovered] = useState(false);

    const handleRefresh = async (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.promise(refreshMutation.mutateAsync(chart.id), {
            loading: 'Refreshing chart data...',
            success: 'Chart updated!',
            error: 'Failed to refresh',
        });
    };

    return (
        <Card
            className={`relative overflow-hidden bg-slate-900/60 border-slate-800 backdrop-blur-md transition-all duration-300 ${isHovered ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            <CardHeader className="pb-2 relative flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-bold text-slate-200">
                    {chart.title || `${chart.type} Chart`}
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-cyan-400"
                    onClick={handleRefresh}
                    disabled={refreshMutation.isPending}
                >
                    <RefreshCw className={`w-4 h-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>

            <CardContent className="relative">
                {refreshMutation.isPending ? (
                    <Skeleton className="w-full h-48 bg-slate-800/50" />
                ) : (
                    children
                )}
            </CardContent>

            {/* Neon accent */}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-purple-500 transition-transform duration-500 origin-left ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
        </Card>
    );
}
