'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BarChart2, LineChart, PieChart, ScatterChart, AreaChart } from 'lucide-react';
import { ChartSuggestion } from '@repo/shared-types/insights';

interface SuggestionCardProps {
    suggestion: ChartSuggestion;
    onApply?: () => void;
}

const ChartIcons: Record<string, any> = {
    line: LineChart,
    bar: BarChart2,
    pie: PieChart,
    scatter: ScatterChart,
    area: AreaChart,
};

export function SuggestionCard({ suggestion, onApply }: SuggestionCardProps) {
    const ChartIcon = ChartIcons[suggestion.type] || BarChart2;

    return (
        <Card className="bg-gradient-to-br from-slate-900/60 to-cyan-900/10 border-cyan-500/10 hover:border-cyan-500/30 transition-all group cursor-pointer" onClick={onApply}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        {suggestion.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-cyan-500/5 text-cyan-400 border-cyan-500/20 gap-1">
                        <ChartIcon className="w-3 h-3" />
                        {suggestion.type}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-xs text-slate-400">{suggestion.reason}</p>
                <div className="flex gap-4 text-[10px] font-mono text-slate-500">
                    <span>X: <span className="text-cyan-300">{suggestion.xAxis}</span></span>
                    <span>Y: <span className="text-fuchsia-300">{suggestion.yAxis}</span></span>
                </div>
            </CardContent>
        </Card>
    );
}
