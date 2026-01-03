'use client';

import React from 'react';
import { InsightSummaryCard } from './InsightSummaryCard';
import { PatternCard } from './PatternCard';
import { AnomalyCard } from './AnomalyCard';
import { SuggestionCard } from './SuggestionCard';
import { DashboardInsight } from '@repo/shared-types/insights';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';

interface InsightPanelProps {
    insights: DashboardInsight | null;
    isLoading?: boolean;
}

export function InsightPanel({ insights, isLoading }: InsightPanelProps) {
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <Skeleton className="h-40 w-full bg-slate-900/50" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32 bg-slate-900/50" />
                    <Skeleton className="h-32 bg-slate-900/50" />
                    <Skeleton className="h-32 bg-slate-900/50" />
                </div>
            </div>
        );
    }

    if (!insights) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <InsightSummaryCard summary={insights.summary} generatedAt={insights.generatedAt} />

            {insights.patterns?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-fuchsia-400" />
                        Detected Patterns
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {insights.patterns.map((pattern, i) => (
                            <PatternCard key={i} pattern={pattern} />
                        ))}
                    </div>
                </div>
            )}

            {insights.anomalies?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                        Anomalies Detected
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.anomalies.map((anomaly, i) => (
                            <AnomalyCard key={i} anomaly={anomaly} />
                        ))}
                    </div>
                </div>
            )}

            {insights.chartSuggestions?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        Chart Suggestions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {insights.chartSuggestions.map((suggestion, i) => (
                            <SuggestionCard key={i} suggestion={suggestion} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
