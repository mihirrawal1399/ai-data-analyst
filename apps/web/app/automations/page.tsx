'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationList } from '@/components/automations/AutomationList';

// Mock user ID for now - should come from auth
const MOCK_USER_ID = 'user-123';

export default function AutomationsPage() {
    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 sm:text-5xl lg:text-6xl">
                        Automations
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-2">
                        Scheduled insights, trend detection & smart alerts.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" asChild className="text-slate-400 hover:text-white border border-slate-800">
                        <Link href="/" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </Button>
                    <Button asChild className="bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20">
                        <Link href="/automations/create" className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Automation
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="relative">
                {/* Grid background effect */}
                <div className="absolute -inset-4 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <AutomationList userId={MOCK_USER_ID} />
            </div>
        </div>
    );
}
