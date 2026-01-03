'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendInsight } from '@repo/shared-types/insights';

interface PatternCardProps {
    pattern: TrendInsight;
}

export function PatternCard({ pattern }: PatternCardProps) {
    const DirectionIcon = pattern.direction === 'up' ? TrendingUp :
        pattern.direction === 'down' ? TrendingDown : Minus;
    const directionColor = pattern.direction === 'up' ? 'text-emerald-400' :
        pattern.direction === 'down' ? 'text-rose-400' : 'text-slate-400';

    return (
        <Card className="bg-slate-900/50 border-fuchsia-500/10 hover:border-fuchsia-500/30 transition-colors group">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-slate-200 group-hover:text-fuchsia-300 transition-colors">
                        {pattern.metric}
                    </CardTitle>
                    <DirectionIcon className={`w-5 h-5 ${directionColor}`} />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-xs text-slate-400">{pattern.description}</p>
                <div className="flex items-center gap-2">
                    {pattern.percentageChange && (
                        <Badge variant="outline" className={`text-[10px] ${directionColor} border-current/20`}>
                            {pattern.percentageChange > 0 ? '+' : ''}{pattern.percentageChange}%
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-[10px] bg-fuchsia-500/10 text-fuchsia-300">
                        {Math.round(pattern.confidence * 100)}% confidence
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
