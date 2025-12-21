'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Clock, Play, ArrowRight, Activity, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUpdateAutomation, useExecuteAutomation } from '@/lib/api/automation-queries';
import { toast } from 'sonner';

interface AutomationCardProps {
    automation: any;
}

const TypeIcons: Record<string, any> = {
    summary: FileText,
    alert: AlertTriangle,
    trend: TrendingUp,
    custom: Activity,
};

const TypeColors: Record<string, string> = {
    summary: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    alert: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    trend: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
    custom: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
};

export function AutomationCard({ automation }: AutomationCardProps) {
    const updateMutation = useUpdateAutomation();
    const executeMutation = useExecuteAutomation();
    const Icon = TypeIcons[automation.type] || Activity;

    const handleToggle = () => {
        updateMutation.mutate({
            id: automation.id,
            doc: { enabled: !automation.enabled }
        });
    };

    const handleRun = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.promise(executeMutation.mutateAsync(automation.id), {
            loading: 'Executing automation...',
            success: 'Execution finished!',
            error: 'Execution failed',
        });
    };

    return (
        <Card className="group relative overflow-hidden bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md shadow-xl hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`capitalize font-mono text-[10px] flex items-center gap-1 ${TypeColors[automation.type]}`}>
                        <Icon className="w-3 h-3" />
                        {automation.type}
                    </Badge>
                    <Switch
                        checked={automation.enabled}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-cyan-500"
                    />
                </div>
                <CardTitle className="text-xl font-bold mt-2 text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {automation.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-slate-400 text-xs mt-1">
                    {automation.description || 'No description provided.'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{automation.schedule}</span>
                </div>

                {automation.lastRun && (
                    <div className="text-[10px] text-slate-500 italic">
                        Last run: {formatDistanceToNow(new Date(automation.lastRun))} ago
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex gap-2 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-black/40 border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-[11px] h-8 gap-1.5"
                    onClick={handleRun}
                    disabled={executeMutation.isPending}
                >
                    <Play className="w-3 h-3 fill-current" />
                    Run Now
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="border border-transparent hover:bg-slate-800 text-[11px] h-8 gap-1.5"
                >
                    <Link href={`/automations/${automation.id}`}>
                        Details
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                </Button>
            </CardFooter>

            {/* Vaporwave accent bar */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </Card>
    );
}
