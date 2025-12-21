'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAutomation, useAutomationResults } from '@/lib/api/automation-queries';
import { ExecutionResultCard } from '@/components/automations/ExecutionResultCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { History, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AutomationResultsPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: automation } = useAutomation(id);
    const { data: results, isLoading, refetch } = useAutomationResults(id, 50);

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild size="icon" className="border border-slate-800">
                        <Link href={`/automations/${id}`}>
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <History className="w-7 h-7 text-cyan-400" />
                            Execution History
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Historical logs for <span className="text-fuchsia-400 font-bold">{automation?.name || 'Automation'}</span>
                        </p>
                    </div>
                </div>

                <Button onClick={() => refetch()} variant="outline" className="border-slate-800 hover:bg-slate-800 gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh History
                </Button>
            </div>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/20 via-fuchsia-500/10 to-transparent pointer-events-none hidden md:block" />

                <div className="space-y-6">
                    {isLoading ? (
                        [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full bg-slate-900/50" />)
                    ) : results?.length > 0 ? (
                        results.map((result: any) => (
                            <div key={result.id} className="relative">
                                <ExecutionResultCard result={result} />
                            </div>
                        ))
                    ) : (
                        <Card className="p-20 text-center bg-slate-900/30 border-slate-800">
                            <div className="text-slate-500 italic">No execution records found for this automation.</div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
