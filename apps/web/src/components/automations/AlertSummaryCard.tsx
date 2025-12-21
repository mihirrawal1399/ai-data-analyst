'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Bell, Zap } from 'lucide-react';

interface AlertSummaryCardProps {
    alertText: string;
    isBreached: boolean;
}

export function AlertSummaryCard({ alertText, isBreached }: AlertSummaryCardProps) {
    return (
        <Card className={`bg-slate-900/40 border-t-2 ${isBreached ? 'border-t-rose-500 border-rose-500/10' : 'border-t-emerald-500 border-emerald-500/10'} backdrop-blur-md overflow-hidden relative`}>
            {isBreached && (
                <div className="absolute top-0 right-0 p-2">
                    <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
                </div>
            )}
            <CardHeader className="pb-2">
                <CardTitle className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isBreached ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isBreached ? <AlertTriangle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    {isBreached ? 'Threshold Breach Detected' : 'Threshold Monitored'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`p-4 rounded border ${isBreached ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'} text-sm font-medium`}>
                    {alertText}
                </div>
            </CardContent>
        </Card>
    );
}
