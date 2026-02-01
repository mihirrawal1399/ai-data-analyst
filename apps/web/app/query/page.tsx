'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatasets } from '@/lib/api/dataset-queries';
import { useAgentQuery } from '@/lib/api/queries';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Send,
    Database,
    Bot,
    Sparkles,
    Table as TableIcon,
    BarChart3,
    History
} from 'lucide-react';
import { toast } from 'sonner';

export default function QueryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialDatasetId = searchParams.get('datasetId');

    const [datasetId, setDatasetId] = useState(initialDatasetId || '');
    const [query, setQuery] = useState('');
    const [history, setHistory] = useState<any[]>([]);

    const { data: datasets, isLoading: datasetsLoading } = useDatasets();
    const agentQuery = useAgentQuery();

    useEffect(() => {
        if (initialDatasetId) {
            setDatasetId(initialDatasetId);
        } else if (datasets?.length && !datasetId) {
            setDatasetId(datasets[0].id);
        }
    }, [initialDatasetId, datasets, datasetId]);

    const handleQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !datasetId) return;

        const currentQuery = query;
        setQuery('');

        // Optimistic UI
        const optimisticId = Date.now();
        setHistory(prev => [...prev, {
            id: optimisticId,
            type: 'user',
            content: currentQuery,
            timestamp: new Date()
        }]);

        setHistory(prev => [...prev, {
            id: optimisticId + 1,
            type: 'agent',
            status: 'loading',
            timestamp: new Date()
        }]);

        try {
            const result = await agentQuery.mutateAsync({
                datasetId,
                question: currentQuery
            });

            // Update agent message with result
            setHistory(prev => prev.map(msg =>
                msg.id === optimisticId + 1 ? {
                    ...msg,
                    status: 'success',
                    data: result,
                    content: 'Here is what I found:'
                } : msg
            ));
        } catch (error) {
            setHistory(prev => prev.map(msg =>
                msg.id === optimisticId + 1 ? {
                    ...msg,
                    status: 'error',
                    content: 'Sorry, I encountered an error processing your query.'
                } : msg
            ));
            toast.error('Query failed');
        }
    };

    return (
        <div className="flex h-screen bg-[#0a0a0f] text-white">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold flex items-center gap-2">
                        <History className="w-4 h-4 text-fuchsia-500" />
                        History
                    </h2>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-2">
                    <p className="text-xs text-slate-500 text-center mt-4">No recent queries</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <Bot className="w-6 h-6 text-cyan-400" />
                        <h1 className="font-semibold text-lg">AI Data Analyst</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <select
                            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:border-cyan-500 outline-none"
                            value={datasetId}
                            onChange={(e) => setDatasetId(e.target.value)}
                        >
                            <option value="" disabled>Select Dataset</option>
                            {datasets?.map((ds: any) => (
                                <option key={ds.id} value={ds.id}>{ds.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Sparkles className="w-16 h-16 text-slate-600 mb-4" />
                            <h3 className="text-2xl font-bold text-slate-300 mb-2">How can I help you?</h3>
                            <p className="max-w-md text-slate-500">
                                Ask questions about your data in plain English. For example:
                                "Show me total revenue by month" or "What is the average transaction value?"
                            </p>
                        </div>
                    ) : (
                        history.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.type === 'agent' && (
                                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] space-y-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block p-4 rounded-2xl ${msg.type === 'user'
                                            ? 'bg-fuchsia-600 text-white rounded-br-none'
                                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                        }`}>
                                        <p>{msg.content}</p>
                                    </div>

                                    {/* Result Display for Agent */}
                                    {msg.type === 'agent' && msg.status === 'loading' && (
                                        <div className="flex gap-2 p-2">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-100" />
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200" />
                                        </div>
                                    )}

                                    {msg.type === 'agent' && msg.data && (
                                        <Card className="mt-2 text-left bg-slate-900 border-slate-700 w-full overflow-hidden">
                                            <div className="p-3 border-b border-slate-800 flex gap-4 text-xs font-mono text-slate-400 bg-slate-950/50">
                                                <div className="flex items-center gap-1">
                                                    <TableIcon className="w-3 h-3" />
                                                    SQL Result
                                                </div>
                                            </div>
                                            <div className="p-4 overflow-x-auto">
                                                <pre className="text-xs text-green-400 font-mono">
                                                    {JSON.stringify(msg.data, null, 2)}
                                                </pre>
                                            </div>
                                        </Card>
                                    )}
                                </div>

                                {msg.type === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center shrink-0">
                                        <div className="w-4 h-4 bg-white rounded-full" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                    <form onSubmit={handleQuery} className="max-w-4xl mx-auto relative">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a question about your data..."
                            className="pr-12 py-6 bg-slate-950 border-slate-700 focus:border-cyan-500 text-lg shadow-lg"
                            disabled={!datasetId || agentQuery.isPending}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-2 top-2 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 bottom-2 my-auto"
                            disabled={!datasetId || !query.trim() || agentQuery.isPending}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-3 font-mono">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
