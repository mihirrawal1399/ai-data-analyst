'use client';

import React, { useState, useEffect } from 'react';
import cronstrue from 'cronstrue';
import { parseExpression } from 'cron-parser';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface SchedulePreviewProps {
    schedule: string;
}

export function SchedulePreview({ schedule }: SchedulePreviewProps) {
    const [description, setDescription] = useState<string>('');
    const [nextRuns, setNextRuns] = useState<Date[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!schedule) {
            setDescription('');
            setNextRuns([]);
            setError(null);
            return;
        }

        try {
            const desc = cronstrue.toString(schedule, { use24HourTimeFormat: true });
            setDescription(desc);

            const interval = parseExpression(schedule);
            const runs = [];
            for (let i = 0; i < 5; i++) {
                runs.push(interval.next().toDate());
            }
            setNextRuns(runs);
            setError(null);
        } catch (e: any) {
            setError('Invalid cron expression');
            setDescription('');
            setNextRuns([]);
        }
    }, [schedule]);

    if (!schedule) return null;

    return (
        <Card className="bg-slate-900/50 border-cyan-500/20 backdrop-blur-sm shadow-lg shadow-cyan-500/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    Schedule Preview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error ? (
                    <p className="text-xs text-rose-500">{error}</p>
                ) : (
                    <>
                        <div className="p-3 bg-black/40 rounded-lg border border-cyan-500/10">
                            <p className="text-sm text-slate-200 font-medium">{description}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Next 5 Runs
                            </p>
                            <div className="grid grid-cols-1 gap-1">
                                {nextRuns.map((date, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 hover:bg-cyan-500/5 rounded transition-colors group">
                                        <span className="text-slate-400 group-hover:text-slate-200">
                                            {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-300">
                                            {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
