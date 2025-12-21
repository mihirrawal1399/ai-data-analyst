'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Timer, Database } from 'lucide-react';
import { format } from 'date-fns';

interface ExecutionResultCardProps {
    result: any;
}

export function ExecutionResultCard({ result }: ExecutionResultCardProps) {
    const isSuccess = result.status === 'success';

    return (
        <Card className={`bg-slate-900/60 border-l-4 ${isSuccess ? 'border-l-emerald-500/50' : 'border-l-rose-500/50'} border-slate-800 backdrop-blur-md`}>
            <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        {isSuccess ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                        <div>
                            <CardTitle className="text-sm font-bold text-slate-200">
                                {isSuccess ? 'Execution Successful' : 'Execution Failed'}
                            </CardTitle>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(result.executedAt), 'MMM d, yyyy HH:mm')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {result.durationMs ? `${result.durationMs}ms` : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className={isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}>
                        {result.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {isSuccess ? (
                    <div className="p-4 bg-black/30 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                        {result.output || 'No output generated.'}
                    </div>
                ) : (
                    <div className="p-4 bg-rose-500/5 rounded-lg border border-rose-500/20 text-sm text-rose-400 italic">
                        Error: {result.error || 'Unknown error occurred during execution.'}
                    </div>
                )}

                {result.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(result.metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="p-2 bg-slate-800/20 rounded border border-slate-800">
                                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{key}</p>
                                <p className="text-sm font-bold text-cyan-400">{typeof value === 'number' ? value.toLocaleString() : String(value)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
