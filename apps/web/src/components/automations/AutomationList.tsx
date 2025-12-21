'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationCard } from './AutomationCard';
import { useAutomations } from '@/lib/api/automation-queries';
import { Skeleton } from '@/components/ui/skeleton';

interface AutomationListProps {
    userId: string;
}

export function AutomationList({ userId }: AutomationListProps) {
    const { data: automations, isLoading, error } = useAutomations(userId);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full bg-slate-900/50 rounded-xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-rose-500/20">
                <p className="text-rose-400">Failed to load automations. Please try again later.</p>
            </div>
        );
    }

    if (!automations || automations.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-cyan-500/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
                <Rocket className="w-16 h-16 text-cyan-500/20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-200 mb-2">No Automations Yet</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Create your first automated insight engine to get reports and alerts delivered to you on schedule.
                </p>
                <Button asChild className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 shadow-lg shadow-cyan-500/20">
                    <Link href="/automations/create" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create First Automation
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation: any) => (
                <AutomationCard key={automation.id} automation={automation} />
            ))}
        </div>
    );
}
