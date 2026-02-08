'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard } from 'lucide-react';

export default function DashboardsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            Dashboards
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Manage and view your data dashboards
                        </p>
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500">
                        <Plus className="w-4 h-4 mr-2" />
                        New Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/60 border-slate-700/50 hover:border-cyan-500/30 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-200">
                                <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                                Getting Started
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400 text-sm">
                                Create your first dashboard by uploading a dataset and asking questions about your data.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Empty state */}
                <div className="mt-12 text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                    <LayoutDashboard className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No dashboards yet</h3>
                    <p className="text-slate-500 mb-4">Create your first dashboard to start visualizing your data</p>
                    <Button
                        onClick={() => router.push('/datasets')}
                        variant="outline"
                        className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
                    >
                        Start with a Dataset
                    </Button>
                </div>
            </div>
        </div>
    );
}
