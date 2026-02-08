'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDataset } from '@/lib/api/dataset-queries';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    Brain,
    Table as TableIcon,
    BarChart3,
    Settings,
    Database,
    Calendar,
    FileSpreadsheet,
    MessageSquare
} from 'lucide-react';

export default function DatasetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const datasetId = params.datasetId as string;
    const { data: dataset, isLoading, error } = useDataset(datasetId);

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 space-y-8">
                <Skeleton className="h-10 w-32 mb-8 bg-slate-900/50" />
                <Skeleton className="h-20 w-3/4 mb-12 bg-slate-900/50" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-slate-900/50" />)}
                </div>
            </div>
        );
    }

    if (error || !dataset) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h3 className="text-xl font-bold text-slate-200 mb-2">Dataset not found</h3>
                <Button onClick={() => router.push('/datasets')} variant="outline">Back to Datasets</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Button
                    variant="ghost"
                    className="w-fit text-slate-400 hover:text-white pl-0 hover:bg-transparent"
                    onClick={() => router.push('/datasets')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Datasets
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2">
                            {dataset.name}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                                <FileSpreadsheet className="w-4 h-4 text-cyan-500" />
                                {dataset.filename}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-slate-600" />
                                {new Date(dataset.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href={`/query?datasetId=${datasetId}`}>
                    <Card className="hover:bg-slate-900/80 transition-colors cursor-pointer border-cyan-500/20 hover:border-cyan-500/50">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-200">Ask Data</h3>
                                <p className="text-xs text-slate-500 mt-1">Query with natural language</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/datasets/${datasetId}/insights`}>
                    <Card className="hover:bg-slate-900/80 transition-colors cursor-pointer border-fuchsia-500/20 hover:border-fuchsia-500/50">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                                <Brain className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-200">Get Insights</h3>
                                <p className="text-xs text-slate-500 mt-1">AI-powered deep analysis</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/datasets/${datasetId}/create-chart`}>
                    <Card className="hover:bg-slate-900/80 transition-colors cursor-pointer border-purple-500/20 hover:border-purple-500/50">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-200">Create Chart</h3>
                                <p className="text-xs text-slate-500 mt-1">Build visualizations</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <div className="cursor-not-allowed opacity-60">
                    <Card className="border-slate-800 bg-slate-900/20">
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-slate-800 text-slate-500">
                                <TableIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-500">Edit Data</h3>
                                <p className="text-xs text-slate-600 mt-1">Coming soon</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/40 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-300">
                            <Database className="w-5 h-5 text-cyan-500" />
                            Dataset Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-500">Row Count</span>
                            <span className="font-mono text-slate-200">{dataset.rowCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-500">Size</span>
                            <span className="font-mono text-slate-200">{(dataset.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-800">
                            <span className="text-slate-500">Type</span>
                            <span className="font-mono text-slate-200">CSV Import</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-300">
                            <TableIcon className="w-5 h-5 text-fuchsia-500" />
                            Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[150px] flex items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-950/30">
                            <p className="text-slate-500 text-sm">Data preview not available in MVP</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
