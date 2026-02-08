'use client';

import React from 'react';
import Link from 'next/link';
import { useDatasets, useDeleteDataset } from '@/lib/api/dataset-queries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Database, Trash2, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function DatasetsPage() {
    const { data: datasets, isLoading, error } = useDatasets();
    const deleteDataset = useDeleteDataset();

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent navigation if inside a link
        if (confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
            try {
                await deleteDataset.mutateAsync(id);
                toast.success('Dataset deleted successfully');
            } catch (err) {
                toast.error('Failed to delete dataset');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 space-y-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48 bg-slate-900/50" />
                    <Skeleton className="h-10 w-32 bg-slate-900/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 bg-slate-900/50" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 mb-4">
                    <Database className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">Failed to load datasets</h3>
                <p className="text-slate-400 mb-6">{(error as Error).message || 'Something went wrong'}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 sm:text-5xl">
                        Datasets
                    </h1>
                    <p className="text-slate-400 font-mono text-sm mt-2">
                        Manage your data sources and uploads.
                    </p>
                </div>

                <Button className="bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Dataset
                </Button>
            </div>

            {datasets?.length === 0 ? (
                <div className="mt-12 text-center py-20 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/20">
                    <Database className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No datasets yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                        Upload a CSV file to get started with analysis and insights.
                    </p>
                    <Button className="bg-cyan-600 hover:bg-cyan-500">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload First Dataset
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasets?.map((dataset) => (
                        <div key={dataset.id} className="group relative">
                            <Link href={`/datasets/${dataset.id}`}>
                                <Card className="h-full bg-slate-900/60 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 group-hover:bg-fuchsia-500/20 group-hover:scale-110 transition-all">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleDelete(e, dataset.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-200 mb-2 truncate group-hover:text-cyan-400 transition-colors">
                                        {dataset.name}
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-3 h-3 text-slate-500" />
                                            <span>{(dataset.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                                            <span className="text-slate-600">•</span>
                                            <span>{dataset.rowCount.toLocaleString()} rows</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-slate-500" />
                                            <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
