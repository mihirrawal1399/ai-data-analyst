'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationDetails } from '@/components/automations/AutomationDetails';
import { useParams } from 'next/navigation';

export default function AutomationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="text-slate-400 hover:text-white border border-slate-800">
                    <Link href="/automations" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Automations
                    </Link>
                </Button>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                    <History className="w-3 h-3" />
                    <span>ID: {id}</span>
                </div>
            </div>

            <AutomationDetails id={id} />
        </div>
    );
}
