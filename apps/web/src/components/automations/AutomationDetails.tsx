'use client';

import React from 'react';
import { useAutomation, useAutomationResults, useExecuteAutomation, useRemoveAutomation } from '@/lib/api/automation-queries';
import { ExecutionResultCard } from './ExecutionResultCard';
import { SchedulePreview } from './SchedulePreview';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Trash2, Calendar, FileText, Activity, AlertTriangle, TrendingUp, History } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface AutomationDetailsProps {
    id: string;
}

const TypeIcons: Record<string, any> = {
    summary: FileText,
    alert: AlertTriangle,
    trend: TrendingUp,
    custom: Activity,
};

export function AutomationDetails({ id }: AutomationDetailsProps) {
    const router = useRouter();
    const { data: automation, isLoading: isLoadingAuto } = useAutomation(id);
    const { data: results, isLoading: isLoadingResults } = useAutomationResults(id, 5);
    const executeMutation = useExecuteAutomation();
    const removeMutation = useRemoveAutomation();

    const handleRun = () => {
        toast.promise(executeMutation.mutateAsync(id), {
            loading: 'Executing automation...',
            success: 'Execution finished!',
            error: 'Execution failed',
        });
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this automation?')) {
            await removeMutation.mutateAsync(id);
            toast.success('Automation deleted');
            router.push('/automations');
        }
    };

    if (isLoadingAuto) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full bg-slate-900/50" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-60 md:col-span-2 bg-slate-900/50" />
                    <Skeleton className="h-60 bg-slate-900/50" />
                </div>
            </div>
        );
    }

    const Icon = TypeIcons[automation.type] || Activity;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-cyan-500/20">
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div className="space-y-1">
                                <Badge variant="outline" className="text-cyan-400 border-cyan-500/20 bg-cyan-500/5 gap-1.5 py-1">
                                    <Icon className="w-3.5 h-3.5" />
                                    {automation.type.toUpperCase()}
                                </Badge>
                                <CardTitle className="text-3xl font-bold text-white mt-2">{automation.name}</CardTitle>
                                <p className="text-slate-400 mt-2">{automation.description || 'No description provided.'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleRun} disabled={executeMutation.isPending} className="border-cyan-500/20 hover:bg-cyan-500/10 text-cyan-400">
                                    <Play className="w-4 h-4 mr-2" />
                                    Run Now
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleDelete} className="border-rose-500/20 hover:bg-rose-500/10 text-rose-400 font-bold">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Target Source</Label>
                                    <p className="text-sm font-medium text-slate-200">{automation.dataset?.name || 'Local Dataset'}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Last Success</Label>
                                    <p className="text-sm font-medium text-slate-200">
                                        {automation.lastRun ? formatDistanceToNow(new Date(automation.lastRun)) + ' ago' : 'Never'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Status</Label>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${automation.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                                        <span className="text-sm font-medium text-slate-200">{automation.enabled ? 'Active/Enabled' : 'Paused/Disabled'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Dashboard Link</Label>
                                    <p className="text-sm font-medium text-slate-200">{automation.dashboard?.name || 'Not linked'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-fuchsia-400" />
                            Recent Executions
                        </h3>
                        <div className="space-y-4">
                            {isLoadingResults ? (
                                [1, 2].map(i => <Skeleton key={i} className="h-40 w-full bg-slate-900/50" />)
                            ) : results?.length > 0 ? (
                                results.map((result: any) => (
                                    <ExecutionResultCard key={result.id} result={result} />
                                ))
                            ) : (
                                <div className="p-10 text-center bg-slate-900/30 rounded-xl border border-slate-800 italic text-slate-500">
                                    No execution records found.
                                </div>
                            )}
                        </div>
                        {results?.length > 0 && (
                            <Button variant="ghost" className="w-full text-slate-400 hover:text-cyan-400" asChild>
                                <Link href={`/automations/${id}/results`}>
                                    View Full History
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-fuchsia-500/20">
                        <CardHeader>
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-fuchsia-500 font-black">Next Scheduled Runs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SchedulePreview schedule={automation.schedule} />
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl border-t-cyan-500/20">
                        <CardHeader>
                            <CardTitle className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-black">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <pre className="text-[10px] bg-black/50 p-4 rounded border border-slate-800 text-cyan-300 font-mono overflow-auto max-h-60">
                                {JSON.stringify(automation.config, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
