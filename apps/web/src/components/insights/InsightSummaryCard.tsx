'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface InsightSummaryCardProps {
    summary: string;
    generatedAt?: Date;
}

export function InsightSummaryCard({ summary, generatedAt }: InsightSummaryCardProps) {
    return (
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-900/40 border-cyan-500/20 backdrop-blur-lg shadow-2xl shadow-cyan-500/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-fuchsia-500/5 pointer-events-none" />
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="relative">
                <p className="text-slate-200 leading-relaxed">{summary}</p>
                {generatedAt && (
                    <p className="text-[10px] text-slate-500 mt-4 font-mono">
                        Generated: {new Date(generatedAt).toLocaleString()}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
