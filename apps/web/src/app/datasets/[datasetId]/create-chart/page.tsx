'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ChartConfigForm } from '@/components/chart-builder/ChartConfigForm';
import { ChartPreview } from '@/components/chart-builder/ChartPreview';
import { useChartPreview, useCreateChart } from '@/lib/api/queries';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: {
        datasetId: string;
    };
}

// Mock columns - in a real app, fetch from API
const MOCK_COLUMNS = ['date', 'revenue', 'users', 'sessions', 'conversion_rate'];

export default function CreateChartPage({ params }: PageProps) {
    const router = useRouter();
    const [config, setConfig] = useState({
        type: 'line' as const,
        xAxis: '',
        yAxis: '',
        title: '',
    });

    const { data, isLoading, refetch } = useChartPreview(params.datasetId, config);
    const createChart = useCreateChart();

    const handleSave = async () => {
        try {
            await createChart.mutateAsync({
                datasetId: params.datasetId,
                type: config.type,
                config: {
                    xAxis: config.xAxis,
                    yAxis: config.yAxis,
                },
                title: config.title || `${config.type} Chart`,
            });
            router.push(`/datasets/${params.datasetId}`);
        } catch (error) {
            console.error('Failed to create chart:', error);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold gradient-text mb-8">
                Create Chart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <Card className="h-fit">
                    <h2 className="text-2xl font-semibold mb-6 text-foreground">
                        Configuration
                    </h2>

                    <ChartConfigForm
                        config={config}
                        onChange={setConfig}
                        columns={MOCK_COLUMNS}
                    />

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => refetch()}
                            disabled={!config.xAxis || !config.yAxis}
                            className="flex-1 px-6 py-3 bg-glow text-white rounded-lg 
                         shadow-neon hover:shadow-neon-hover 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300"
                        >
                            Preview Chart
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!config.xAxis || !config.yAxis || createChart.isPending}
                            className="flex-1 px-6 py-3 border border-glow text-glow rounded-lg 
                         hover:bg-glow/10 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300"
                        >
                            {createChart.isPending ? 'Saving...' : 'Save Chart'}
                        </button>
                    </div>
                </Card>

                {/* Preview Panel */}
                <Card glow className="h-fit">
                    <h2 className="text-2xl font-semibold mb-6 text-foreground">
                        Preview
                    </h2>

                    <ChartPreview
                        config={config}
                        data={data}
                        isLoading={isLoading}
                    />
                </Card>
            </div>
        </div>
    );
}
