import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationForm } from '@/components/automations/AutomationForm';
import { apiClient } from '@/lib/api/client';

async function getInitialData() {
    // In a real app, these would come from TanStack query on client,
    // but we can fetch some stuff server side if we want, or just empty for now.
    // For implementation, we'll assume the client fetches them.
    return {
        datasets: [],
        dashboards: [],
    };
}

// Mock data as fallback for prototype
const MOCK_DATASETS = [
    { id: 'ds-1', name: 'Sales Data 2024' },
    { id: 'ds-2', name: 'User Engagement Metrics' },
];

const MOCK_DASHBOARDS = [
    { id: 'db-1', name: 'Executive Overview' },
    { id: 'db-2', name: 'Marketing ROI' },
];

export default function CreateAutomationPage() {
    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter text-white sm:text-4xl">
                        Create New Automation
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">
                        Configure your periodic insight engine.
                    </p>
                </div>

                <Button variant="ghost" asChild className="text-slate-400 hover:text-white border border-slate-800">
                    <Link href="/automations" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Cancel
                    </Link>
                </Button>
            </div>

            <AutomationForm
                userId="user-123"
                datasets={MOCK_DATASETS}
                dashboards={MOCK_DASHBOARDS}
            />
        </div>
    );
}
