'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap } from 'lucide-react';
import { AnomalyInsight } from '@repo/shared-types/insights';

interface AnomalyCardProps {
    anomaly: AnomalyInsight;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
    const severityColors = {
        low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        medium: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    return (
        <Card className={`bg-slate-900/50 border-l-2 ${anomaly.severity === 'high' ? 'border-l-rose-500' : anomaly.severity === 'medium' ? 'border-l-orange-500' : 'border-l-amber-500'} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        {anomaly.metric}
                    </CardTitle>
                    <Badge variant="outline" className={severityColors[anomaly.severity]}>
                        {anomaly.severity}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-slate-400">{anomaly.description}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-rose-400" />
                        Value: <span className="text-rose-300 font-bold">{anomaly.value}</span>
                    </span>
                    <span>
                        Expected: {anomaly.expectedRange.min} - {anomaly.expectedRange.max}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
