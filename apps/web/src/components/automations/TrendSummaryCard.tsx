'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendSummaryCardProps {
    summary: string;
}

export function TrendSummaryCard({ summary }: TrendSummaryCardProps) {
    // Simple pattern detection from summary text
    const isUp = summary.toLowerCase().includes('increase') || summary.toLowerCase().includes('growth');
    const isDown = summary.toLowerCase().includes('decrease') || summary.toLowerCase().includes('decline');

    return (
        <Card className="bg-slate-900/40 border-fuchsia-500/20 backdrop-blur-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-fuchsia-500 flex items-center justify-between">
                    Trend Intelligence
                    {isUp ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
                        isDown ? <TrendingDown className="w-4 h-4 text-rose-400" /> :
                            <Minus className="w-4 h-4 text-slate-400" />}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-fuchsia-500/5 rounded border border-fuchsia-500/10 text-sm italic text-slate-300">
                    {summary}
                </div>
            </CardContent>
        </Card>
    );
}
