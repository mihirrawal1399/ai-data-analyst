'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useDatasetInsights, useChartSuggestions } from '@/lib/api/insight-queries';
import { InsightPanel } from '@/components/insights/InsightPanel';
import { SuggestionCard } from '@/components/insights/SuggestionCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Brain, Sparkles, RefreshCw, Database, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DatasetInsightsPage() {
    const params = useParams();
    const datasetId = params.datasetId as string;

    const { data: insights, isLoading, refetch, isFetching } = useDatasetInsights(datasetId);
    const { data: suggestionsData, refetch: fetchSuggestions, isLoading: suggestionsLoading } = useChartSuggestions(datasetId);

    const handleAnalyze = () => {
        toast.promise(refetch(), {
            loading: 'Analyzing dataset with AI...',
            success: 'Analysis complete!',
            error: 'Analysis failed',
        });
    };

    const handleSuggestCharts = () => {
        toast.promise(fetchSuggestions(), {
            loading: 'Generating chart suggestions...',
            success: 'Suggestions ready!',
            error: 'Failed to generate suggestions',
        });
    };

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild size="icon" className="border border-slate-800">
                        <Link href={`/datasets/${datasetId}/explore`}>
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Brain className="w-8 h-8 text-fuchsia-400" />
                            Dataset Insights
                        </h1>
                        <p className="text-slate-400 text-sm mt-1 font-mono">
                            AI-powered analysis and recommendations
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleAnalyze}
                        className="bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 shadow-lg"
                        disabled={isFetching}
                    >
                        <Sparkles className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Analyzing...' : 'Analyze Dataset'}
                    </Button>
                    <Button
                        onClick={handleSuggestCharts}
                        variant="outline"
                        className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
                        disabled={suggestionsLoading}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Suggest Charts
                    </Button>
                </div>
            </div>

            {/* Insights Panel */}
            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-40 w-full bg-slate-900/50" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-32 bg-slate-900/50" />
                        <Skeleton className="h-32 bg-slate-900/50" />
                        <Skeleton className="h-32 bg-slate-900/50" />
                    </div>
                </div>
            ) : insights ? (
                <div className="space-y-8">
                    <InsightPanel insights={insights as any} />

                    {/* Column Descriptions */}
                    {insights.columnDescriptions?.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Database className="w-5 h-5 text-cyan-400" />
                                Column Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {insights.columnDescriptions.map((col: any, i: number) => (
                                    <div
                                        key={i}
                                        className="p-4 bg-slate-900/40 border border-slate-800 rounded-lg hover:border-cyan-500/30 transition-colors"
                                    >
                                        <p className="text-sm font-bold text-cyan-400">{col.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{col.dataType}</p>
                                        <p className="text-xs text-slate-400 mt-2">{col.description}</p>
                                        {col.nullPercentage > 0 && (
                                            <p className="text-[10px] text-amber-400 mt-2">
                                                {col.nullPercentage}% missing values
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Data Quality Issues */}
                    {insights.dataQualityIssues?.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                ⚠️ Data Quality Issues
                            </h3>
                            <div className="space-y-2">
                                {insights.dataQualityIssues.map((issue: any, i: number) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg border-l-2 ${issue.severity === 'high' ? 'border-l-rose-500 bg-rose-500/5' :
                                                issue.severity === 'medium' ? 'border-l-amber-500 bg-amber-500/5' :
                                                    'border-l-slate-500 bg-slate-900/40'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-200">{issue.column}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded ${issue.severity === 'high' ? 'bg-rose-500/20 text-rose-400' :
                                                    issue.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-slate-700 text-slate-400'
                                                }`}>
                                                {issue.severity}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
                                        <p className="text-[10px] text-slate-500 mt-2">
                                            Affected rows: {issue.affectedRows?.toLocaleString() || 'Unknown'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-fuchsia-500/10">
                    <Brain className="w-16 h-16 text-fuchsia-500/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Analysis Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Click "Analyze Dataset" to generate AI-powered insights about your data.
                    </p>
                </div>
            )}

            {/* Chart Suggestions */}
            {suggestionsData?.suggestions?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        💡 Recommended Charts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestionsData.suggestions.map((suggestion: any, i: number) => (
                            <SuggestionCard key={i} suggestion={suggestion} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
